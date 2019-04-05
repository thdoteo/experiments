<?php
$url = 'https://api-ratp.pierre-grimaud.fr/v3/schedules/' . $_GET['type'] . '/' . $_GET['code'] . '/' . str_replace(' ', '+', $_GET['station']) . '/' . $_GET['way'];
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, false);
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
$response = curl_exec($curl);
curl_close($curl);

echo $response;

// echo '{
//     "result": {
//         "schedules": [
//             {
//                 "message": "0 mn",
//                 "destination": "Porte D Italie"
//             },
//             {
//                 "message": "24 mn",
//                 "destination": "Porte D Italie"
//             }
//         ]
//     },
//     "_metadata": {
//         "call": "GET /schedules/bus/185/villejuif+division+leclerc/R",
//         "date": "2017-04-18T22:10:00+02:00",
//         "version": 3
//     }
// }';