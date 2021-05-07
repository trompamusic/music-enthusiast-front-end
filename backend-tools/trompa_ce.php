
<?php
/*
WARNING: This is an example for a php backend to interact with the CE-API.
This file can't run standalone and requires the entire back-end to work.
*/

include_once('Crypt/RSA.php');
include_once("arc/ARC2.php");
include_once("Graphite.php");

use \Firebase\JWT\JWT;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

define("TROMPA_SERVER", "https://trompa-mtg.upf.edu/ce/");
define("USERS_BASE_URI", "<base_url>/users/");
define("RATING_DEFINITION_ADDITIONAL_TYPE", "https://vocab.trompamusic.eu/vocab#RatingDefinition");

/*Solid methods for token validation and for requests to user POD*/
function validate_solid_token($token) {
    $st = explode(".",$token);
    $dec_token = array(
        "header" => json_decode(base64_decode($st[0])),
        "payload" => json_decode(base64_decode($st[1])),
    );

    $issuer = $dec_token["payload"]->iss . '/jwks';
    $handle = curl_init($issuer);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    $result=curl_exec($handle);
    curl_close($handle);
    $jwks = json_decode($result, true);
    $jwks = array_filter($jwks["keys"], function ($k) use ($dec_token) { return $k["alg"] == $dec_token["header"]->alg;});
    $pkeys_raw = [];
    foreach ($jwks as $k) {
        $modulus = $k["n"];
        $modulus = str_replace("-","+",$modulus);
        $modulus = str_replace("_","/",$modulus);

        $exponent = $k["e"];

        $rsa = new Crypt_RSA();

        $modulus = new Math_BigInteger(base64_decode($modulus), 256);
        $exponent = new Math_BigInteger(base64_decode($exponent), 256);

        $rsa->loadKey(array('n' => $modulus, 'e' => $exponent));
        $rsa->setPublicKey();

        $pkeys_raw[$k["kid"]] = $rsa->getPublicKey();
    }
    $decoded = JWT::decode($token,$pkeys_raw, array($dec_token["header"]->alg));
    if ($decoded != null && time() > $decoded->exp) {
        $decoded = null;
    }
    return $decoded;
}
function get_user_from_solid_token($dec_token) {
    $issuer = str_replace("https://", "", $dec_token->iss);
    $username = str_replace("https://", "", $dec_token->sub);

    $graph = new Graphite();
    $username = explode("/",$username)[0];
    $username = str_replace("." . $issuer, "", $username);
    $graph->ns("card", explode("#", $dec_token->sub)[0] . "#");
    $graph->load("card:me");
    $userinfo = [];
    $userinfo['name'] = $graph->resource("card:me")->label();
    $userinfo['username'] = $username;
    $userinfo['email'] = $username . "@" . $issuer;
    $userinfo['password'] = $dec_token->azp;
    return $userinfo;
}

/*The user uri is the user Solid POD for Solid logged users, otherwise, the uri is USERS_BASE_URI/<userId>*/
function get_user_uri($authorization, $userId) {
    $creator = false;
    if (!empty($authorization)) {
        $solid_access_token = null;
        if (preg_match('/Bearer\s(\S+)/', $authorization, $matches)) {
            $solid_access_token = $matches[1];
        }
        $dec_token = validate_solid_token($solid_access_token);
        if ($dec_token) {
            $creator = $dec_token->sub;
        }
    } else {
        $creator = USERS_BASE_URI . $userId;
    }
    return $creator;
}

/*Method to get a new valid CE token*/
function get_ce_token($ce_login) {
    if (empty($ce_login))
        throw new Exception("CE login data not configured.");
    $ce_credentials = file_get_contents($ce_login["client_secret_json_location"]);
    if ($ce_credentials === false)
        throw new Exception("CE login data not configured.");

    $client = new GuzzleHttp\Client([
        'base_uri' => TROMPA_SERVER,
        'defaults' => [ 'exceptions' => false ],
    ]);
    try {
        $response = $client->request('POST', 'jwt', [
            'headers' =>  [ 'Content-Type' => 'application/json' ],
            'body'   => $ce_credentials
        ]);
    } catch (Exception $e) {
        return $e->getMessage();
    }

    $json = $response->getBody()->getContents();
    $body = json_decode($json);
    return $body->jwt;
}

/*Method to submit GraphQL queries/mutations to the CE*/
function submit_ce_query($query) {
    global $CONFIG;
    $headers =  [ 'Content-Type' => 'application/json' ];
    if ($CONFIG->cetoken) $headers['authorization'] = 'Bearer ' . $CONFIG->cetoken;
    $client = new GuzzleHttp\Client([
        'defaults' => [
            'exceptions' => false
        ],
    ]);
    $response = $client->request('POST', TROMPA_SERVER, [
        'headers' => $headers,
        'json' => [
            'query' => $query
        ]
    ]);

    $json = $response->getBody()->getContents();
    $body = json_decode($json);
    if ($body->data) return $body->data;
    else throw new \Exception("CE query error:" . $query);
    return $body->data?:false;
}

/*Methods for create and submit annotations*/
function get_id_from_set($value, $set) {
    $query = <<<SQL
SELECT termId from TRMP_ce_DefinedTermSets
WHERE setName='{$set}' AND termCode='{$value}'
SQL;
    $data = get_data($query, "");
    return $data && $data[0]? $data[0]->termId : false;
    return false;
}

function get_id_from_motivaiton($motivation) {
    $query = <<<SQL
SELECT identifier from TRMP_ce_Motivations
WHERE name='{$motivation}'
SQL;
    $data = get_data($query, "");
    return $data && $data[0]? $data[0]->identifier : false;
}

function get_id_from_binary($value, $set) {
    $value_tag = $value? 'yes' : 'no';
    return get_id_from_set($value_tag, $set);
}

function get_comments_and_ids($comments) {
    $ids = [];
    $free = [];
    foreach ($comments as $c) {
        if ($c !== "") {
            $termId = get_id_from_set($c, 'TaggingReason');
            if (!$termId) $free[] = $c;
            else $ids[] = $termId;
        }
    }
    return ["ids" => $ids, "free" => $free ];
}

function get_song_public_id($id) {
    $query = <<<SQL
SELECT s.publicId FROM TRMP_tblSongs s
WHERE s.guid = {$id}
SQL;
    $data = get_data($query, "");
    return $data && $data[0]? $data[0]->publicId : false;
}

function get_song_identifier($id) {
    $query = <<<GQL
query {
    AudioObject(source: "https://www.muziekweb.nl/Embed/{$id}"){
        identifier
    }
}
GQL;
    $result = submit_ce_query($query);
    return $result->AudioObject && $result->AudioObject[0]? $result->AudioObject[0]->identifier : false;
}

function create_annotation_target($user_uri) {
    $target_query = <<<GQL
mutation {
    CreateAnnotationCETarget(
        creator: "{$user_uri}"
        field: {}
    ) {
        identifier
    }
}
GQL;

}

function set_motivations_from_ce() {
    $sets = ['emotionalContentTagging', 'arousalRating','valenceRating','emotionalAnnotationsLinking','emotionalContentDescription'];
    $inserted = [];
    foreach($sets as $set) {
        $query = <<<GQL
query {
  AnnotationCEMotivation(title: "{$set}") {
    identifier
    title
    description
    broaderMotivation
  }
}
GQL;
        $motivation = submit_ce_query($query);
        if (!$motivation) return false;
        $sql_query = <<<SQL
DELETE FROM TRMP_ce_Motivations WHERE name='{$set}'
SQL;
        delete_data($sql_query);
        $motivation = $motivation && $motivation->AnnotationCEMotivation? $motivation->AnnotationCEMotivation[0] : false;
        $sql_query = <<<SQL
INSERT INTO TRMP_ce_Motivations (name,identifier,broadermotivation)
VALUES ('{$motivation->title}', '{$motivation->identifier}','{$motivation->broaderMotivation}');
SQL;
        $inserted[] = insert_data($sql_query);
    }
    return $inserted;
}

function set_definedtermsets_from_ce() {
    $sets = ['TaggingReason', 'like_the_song','know_the_song','emotion_tags'];
    $inserted = [];
    foreach($sets as $lset) {
        $query = <<<GQL
query {
    DefinedTermSet(name: "{$lset}") {
        name
        identifier
        hasDefinedTerm {
            identifier
            termCode
        }
    }
    }
GQL;
        $set = submit_ce_query($query);
        if (!$set) return false;
        $sql_query = <<<SQL
DELETE FROM TRMP_ce_DefinedTermSets WHERE setName='{$lset}'
SQL;
        delete_data($sql_query);
        $set = $set && $set->DefinedTermSet? $set->DefinedTermSet[0] : false;
        foreach ($set->hasDefinedTerm as $term) {
            $sql_query = <<<SQL
INSERT INTO TRMP_ce_DefinedTermSets (setName,setId,termCode,termId)
VALUES ('{$set->name}', '{$set->identifier}','{$term->termCode}', '{$term->identifier}');
SQL;
            $inserted[] = insert_data($sql_query);
        }
    }
    return $inserted;
}

function m_CreateAnnotationCETarget($creator, $field=false, $target) {
    $query = <<<GQL
mutation {
        CreateAnnotationCETarget(
            creator: "{$creator}"
        ) {
            identifier
        }
    }
GQL;
    if ($field) {
        $query = <<<GQL
mutation {
        CreateAnnotationCETarget(
            creator: "{$creator}"
            field: "{$field}"
        ) {
            identifier
        }
    }
GQL;
    }
    $result = submit_ce_query($query);
    $cetarget_id = $result->CreateAnnotationCETarget->identifier;
    $query = <<<GQL
mutation {
    MergeAnnotationCETargetTarget(
      from: {identifier: "{$cetarget_id}"}
      to: {identifier: "{$target}"}
    ) {
      from {
        identifier
      }
      to {
        identifier
      }
    }
}
GQL;
    submit_ce_query($query);
    return $cetarget_id;
}

function m_CreateAnnotation($creator, $motivation) {
    $query = <<<GQL
mutation {
    CreateAnnotation(
      creator: "{$creator}"
      motivation: {$motivation}
    ) {
      identifier
    }
}
GQL;
    $result = submit_ce_query($query);
    return $result->CreateAnnotation->identifier;
}

function m_MergeAnnotationMotivationNode($from, $to) {
    $query = <<<GQL
mutation {
    MergeAnnotationMotivationNode (
        from: {identifier: "{$from}"}
        to: {identifier: "{$to}"}
    ) {
        from {
            identifier
        }
        to {
            identifier
        }
    }
}
GQL;
    submit_ce_query($query);
}

function m_MergeAnnotationTargetNode($from, $to) {
    $query = <<<GQL
mutation {
    MergeAnnotationTargetNode(
      from: {identifier: "{$from}"}
      to: {identifier: "{$to}"}
    ) {
      from {
        identifier
      }
      to {
        identifier
      }
    }
}
GQL;
    submit_ce_query($query);
}

function m_MergeAnnotationBodyNode($from, $to) {
    $query = <<<GQL
mutation {
    MergeAnnotationBodyNode(
      from: {identifier: "{$from}"}
      to: {identifier: "{$to}"}
    ) {
      from {
        identifier
      }
      to {
        identifier
      }
    }
}
GQL;
    submit_ce_query($query);
}

function m_CreateAnnotationTextualBody($creator, $value, $language) {
    $query = <<<GQL
mutation {
    CreateAnnotationTextualBody(
        creator: "{$creator}"
        value: "{$value}"
        format: "text/plain"
        language: {$language}
    ) {
        identifier
    }
}
GQL;
    $result = submit_ce_query($query);
    return $result->CreateAnnotationTextualBody->identifier;
}

function m_MergeAnnotationBodyText($from, $to) {
    $query = <<<GQL
mutation {
    MergeAnnotationBodyText(
    from: {identifier: "{$from}"}
    to: {identifier: "{$to}"}
    ) {
    from {
        identifier
    }
    to {
        identifier
    }
    }
}
GQL;
    submit_ce_query($query);
}

function m_CreateRating($creator, $rating, $ratingValue) {
    $additionalType = RATING_DEFINITION_ADDITIONAL_TYPE;
    $query = <<<GQL
mutation {
    CreateRating(
        creator: "{$creator}"
        name: "{$rating["name"]}"
        ratingValue: {$ratingValue}
        bestRating: {$rating["max"]}
        worstRating: {$rating["min"]}
        additionalType: "{$additionalType}"
    ) {
        identifier
    }
}
GQL;
    $result = submit_ce_query($query);
    return $result->CreateRating->identifier;
}

function linkAnnotationsOfAnnotation($userid, $defIds, $freeTxts, $target, $language) {
    $cetarget = m_CreateAnnotationCETarget($userid, null, $target);
    $def = [];
    $motivation = get_id_from_motivaiton('emotionalContentDescription');
    $broadMotivation = "describing";
    foreach ($defIds as $value) {
        $result = createDefTermAnnotation($userid, $value, $cetarget, $motivation, $broadMotivation);
        $def[] = $result;
    }
    $free = [];
    foreach ($freeTxts as $value) {
        $result = createFreeTextAnnotation($userid, $value, $motivation, $broadMotivation, $language, $cetarget);
        $free[] = $result;
    }
    return ['cetarget' => $cetarget, 'def' => $def, 'free' => $free];
}

function createDefTermAnnotation($userid, $value, $target, $motivation = false, $broadMotivation = "tagging") {
    //1. Create annotation (result in annotation_id)
    $annotation_id = m_CreateAnnotation($userid, $broadMotivation);

    //2. If custom motivation, Join annotation to custom motivation
    if ($motivation) {
        m_MergeAnnotationMotivationNode($annotation_id, $motivation);
    }

    //3. Link annotation to target
    m_MergeAnnotationTargetNode($annotation_id, $target);

    //4. Link annotation to body
    m_MergeAnnotationBodyNode($annotation_id, $value);
    return $annotation_id;
}
function createFreeTextAnnotation($userid, $value, $motivation = false, $broadMotivation = "tagging", $language, $target) {
    //1. Create annotationTextualBody(result of mutation in body_id)
    $body_id = m_CreateAnnotationTextualBody($userid, $value, $language);

    //2. Create annotation (result in annotation_id)
    $annotation_id = m_CreateAnnotation($userid, $broadMotivation);

    //3. If custom motivation, Join annotation to custom motivation
    if ($motivation) {
        m_MergeAnnotationMotivationNode($annotation_id, $motivation);
    }

    //4. Link annotation to target
    m_MergeAnnotationTargetNode($annotation_id, $target);

    //5. Link annotation to body
    m_MergeAnnotationBodyText($annotation_id, $body_id);

    return $annotation_id;
}
function createRatingAnnotation($userid, $value, $rating, $motivation = false, $target) {

    //1. Create Rating (result of mutation in rating_id)
    $rating_id = m_CreateRating($userid, $rating, $value);

    //2. Create annotation (result in annotation_id)
    $annotation_id = m_CreateAnnotation($userid, "assessing");

    //3. If custom motivation, Join annotation to custom motivation

    if ($motivation) {
        m_MergeAnnotationMotivationNode($annotation_id, $motivation);
    }

    //4. Link annotation to target
    m_MergeAnnotationTargetNode($annotation_id, $target);

    //5. Link annotation to body
    m_MergeAnnotationBodyNode($annotation_id, $rating_id);
    return $annotation_id;
}
function createMetaAnnotation($userid, $values=[], $motivation = false, $target, $broadMotivation = "linking") {
    if (sizeof(values) > 0) {
        //1. Create meta-annotation
        $annotation_id = m_CreateAnnotation($userid, $broadMotivation);

    //2. Link annotation to target
    m_MergeAnnotationTargetNode($annotation_id, $target);

    //3. If custom motivation, Join annotation to custom motivation
    if ($motivation) {
        m_MergeAnnotationMotivationNode($annotation_id, $motivation);
    }

    foreach ($values as $value) {
            if ($value) m_MergeAnnotationBodyNode($annotation_id, $value);
    }
    return $annotation_id;
}
    return null;
}
function mutateAnnotation($annotation) {
    $RATING = [
        'AROUSAL'=> [
            'name' => 'arousalRating',
            'min' => -1,
            'max' => 1,
        ],
        'VALENCE'=> [
            'name' => 'valenceRating',
            'min' => -1,
            'max' => 1,
        ]
    ];
    $userid = $annotation["userid"];
    $target = $annotation["songid"];
    //1. Create annotationCEtarget (result of mutation in aotarget_id)
    $ao_target = m_CreateAnnotationCETarget($userid, "source", $target);

    //2. known def annotation
    $knowna_id = createDefTermAnnotation($userid, $annotation["knownid"], $ao_target);

    //3. like def annotation
    $likea_id = createDefTermAnnotation($userid, $annotation["likeid"], $ao_target);

    //4. mood def annotation
    $mooda_id = createDefTermAnnotation($userid, $annotation["moodid"], $ao_target, get_id_from_motivaiton('emotionalContentTagging'));

    //5. mood reason annotations (freeText or def)
    $mood_reasons = linkAnnotationsOfAnnotation(
        $userid,
        $annotation["moodComments"]["ids"],
        $annotation["moodComments"]["free"],
        $mooda_id,
        $annotation["language"]
    );

    //6. arousal rating annotation
    $arousala_id = createRatingAnnotation($userid, $annotation["arousalRating"], $RATING["AROUSAL"], get_id_from_motivaiton('arousalRating'), $ao_target);

    //7. Arousal reason annotations (freeText or def)
    $arousal_reasons = linkAnnotationsOfAnnotation(
        $userid,
        $annotation["arousalComments"]["ids"],
        $annotation["arousalComments"]["free"],
        $arousala_id,
        $annotation["language"]
    );

    //8. valence rating annotation
    $valencea_id = createRatingAnnotation($userid, $annotation["valenceRating"], $RATING["VALENCE"], get_id_from_motivaiton('valenceRating'), $ao_target);

    //9. Valence reason annotations (freeText or def)
    $valence_reasons = linkAnnotationsOfAnnotation(
        $userid,
        $annotation["valenceComments"]["ids"],
        $annotation["valenceComments"]["free"],
        $valencea_id,
        $annotation["language"]
    );

    //10. freeMood freeText annotation
    $freemooda_id = null;
    if ($annotation["freeMood"]) {
        $freemooda_id = createFreeTextAnnotation($userid, $annotation["freeMood"], get_id_from_motivaiton('emotionalContentTagging'), 'tagging', $annotation["language"], $ao_target);
    }

    //created_at freeText annotation

    //duration freeText annotation

    //11. meta-annotion (link all annotations)
    $values = array_merge(
        [ $knowna_id, $likea_id, $mooda_id, $arousala_id, $valencea_id, $freemooda_id],
        $mood_reasons["def"], $mood_reasons["free"],
        $arousal_reasons["def"], $arousal_reasons["free"],
        $valence_reasons["def"], $valence_reasons["free"]
    );

    $meta_id = createMetaAnnotation($userid, $values, get_id_from_motivaiton('emotionalAnnotationsLinking'), $ao_target);
    return [
        'meta_id' => $meta_id,
        'knowna_id' => $knowna_id,
        'likea_id' => $likea_id,
        'mooda_id' => $mooda_id,
        'mood_reasons' => $mood_reasons,
        'arousala_id' => $arousala_id,
        'arousal_reasons' => $arousal_reasons,
        'valencea_id' => $valencea_id,
        'valence_reasons' => $valence_reasons,
        'freemooda_id' => $freemooda_id
    ];
}


function get_user_language_code($language) {
    $CE_LANGUAGES = ['en', 'es', 'ca', 'nl', 'de', 'fr'];
    if (in_array($language, $CE_LANGUAGES)) {
        return $language;
    } else {
        return 'en';
    }
}
function send_annotation_to_ce($user, $annotation) {
    global $CONFIG;
    $CONFIG->cetoken = get_ce_token($CONFIG->ce_login);
    $publicId = get_song_public_id($annotation->songId);
    $song_ce_identifier = get_song_identifier($publicId);
    if (!$song_ce_identifier) return [
        'error' => true,
        'data' => 'song is not available in CE...'
    ];
    $ce_annotation = [
        "source" => "https://www.muziekweb.nl/Embed/" . $publicId,
        "songid" => $song_ce_identifier,
        "userid" => "https://ilde.upf.edu/trompa/users/" . $user->guid,
        "knownid" => get_id_from_binary($annotation->knownSong, 'know_the_song'),
        "likeid" => get_id_from_binary($annotation->favSong, 'like_the_song'),
        "arousalRating" => $annotation->arousalValue,
        "valenceRating" => $annotation->valenceValue,
        "moodid" => get_id_from_set($annotation->moodValue, 'emotion_tags'),
        "arousalComments" => get_comments_and_ids(explode(",",$annotation->arousalComment)),
        "valenceComments" => get_comments_and_ids(explode(",",$annotation->valenceComment)),
        "moodComments" => get_comments_and_ids(explode(",",$annotation->moodComment)),
        "freeMood" => $annotation->freeMood,
        "created_at" => getdate()[0], //timestamp,
        "duration" => $annotation->annotationTime,
        "language" => get_user_language_code($user->language),
    ];
    try {
        $data = mutateAnnotation($ce_annotation);
        $result = [
            'error' => false,
            'data' => $data,
        ];
    } catch (Exception $e) {
        $result = [
            'error' => true,
            'data' => $e,
        ];
    }
    return $result;
}
