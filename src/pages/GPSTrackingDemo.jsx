import React, { useState } from 'react';
import LeafletMap from '../components/LeafletMap';

const GPSTrackingDemo = () => {
  const [selectedData, setSelectedData] = useState('sample');

  const sampleData = {
    "id": "5426225798069731000",
    "startTime": "2025-08-29T18:59:18.966+05:30",
    "sport": "Biking",
    "creator": "Fitbit iPhone App",
    "trackPoints": [
        {
            "time": "2025-08-29T18:59:18.966+05:30",
            "position": {
                "latitude": "30.71123206849375",
                "longitude": "76.80884406363346"
            },
            "altitude": "338.66575648342416",
            "distance": "0.0"
        },
        {
            "time": "2025-08-29T18:59:31.972+05:30",
            "position": {
                "latitude": "30.71122617172738",
                "longitude": "76.80883846399499"
            },
            "altitude": "338.73260226544545",
            "distance": "0.8464668361568407"
        },
        {
            "time": "2025-08-29T19:00:01.972+05:30",
            "position": {
                "latitude": "30.711190791129145",
                "longitude": "76.80880486616417"
            },
            "altitude": "339.1336769575732",
            "distance": "5.925268288360884"
        },
        {
            "time": "2025-08-29T19:01:01.972+05:30",
            "position": {
                "latitude": "30.711184894362773",
                "longitude": "76.8087992665257"
            },
            "altitude": "339.2005227395945",
            "distance": "6.771735269401359"
        },
        {
            "time": "2025-08-29T19:02:01.972+05:30",
            "position": {
                "latitude": "30.711082853622454",
                "longitude": "76.8087573977108"
            },
            "altitude": "335.3073144751778",
            "distance": "19.171991419990825"
        },
        {
            "time": "2025-08-29T19:03:01.972+05:30",
            "position": {
                "latitude": "30.71109878904702",
                "longitude": "76.80898026419025"
            },
            "altitude": "335.0800407592974",
            "distance": "110.82645742382783"
        },
        {
            "time": "2025-08-29T19:10:00.000+05:30",
            "position": {
                "latitude": "30.711107057650768",
                "longitude": "76.80904655217809"
            },
            "altitude": "335.4329766322319",
            "distance": "139.84107835287915"
        },
        {
            "time": "2025-08-29T19:20:00.000+05:30",
            "position": {
                "latitude": "30.71117079628788",
                "longitude": "76.80856550863149"
            },
            "altitude": "335.78214792441577",
            "distance": "378.42674161727007"
        },
        {
            "time": "2025-08-29T19:30:00.000+05:30",
            "position": {
                "latitude": "30.710905097483127",
                "longitude": "76.80778762244194"
            },
            "altitude": "337.0753973202419",
            "distance": "580.6678233457901"
        },
        {
            "time": "2025-08-29T19:40:00.000+05:30",
            "position": {
                "latitude": "30.700463645499962",
                "longitude": "76.80303457042828"
            },
            "altitude": "330.5904762689024",
            "distance": "2068.1878485538678"
        },
        {
            "time": "2025-08-29T19:45:05.516+05:30",
            "position": {
                "latitude": "30.690149805833684",
                "longitude": "76.81466538667293"
            },
            "altitude": "325.9359058300033",
            "distance": "4446.878656324786"
        }
    ]
  };

  const fullTrackData = {
    "id": "5426225798069731000",
    "startTime": "2025-08-29T18:59:18.966+05:30",
    "sport": "Biking",
    "creator": "Fitbit iPhone App",
    "trackPoints": [
        {
            "time": "2025-08-29T18:59:18.966+05:30",
            "position": {
                "latitude": "30.71123206849375",
                "longitude": "76.80884406363346"
            },
            "altitude": "338.66575648342416",
            "distance": "0.0"
        },
        {
            "time": "2025-08-29T18:59:23.966+05:30",
            "position": {
                "latitude": "30.71123206849375",
                "longitude": "76.80884406363346"
            },
            "altitude": "338.66575648342416",
            "distance": "0.0"
        },
        {
            "time": "2025-08-29T18:59:26.972+05:30",
            "position": {
                "latitude": "30.71123206849375",
                "longitude": "76.80884406363346"
            },
            "altitude": "338.66575648342416",
            "distance": "0.0"
        },
        {
            "time": "2025-08-29T18:59:31.972+05:30",
            "position": {
                "latitude": "30.71122617172738",
                "longitude": "76.80883846399499"
            },
            "altitude": "338.73260226544545",
            "distance": "0.8464668361568407"
        },
        {
            "time": "2025-08-29T18:59:36.972+05:30",
            "position": {
                "latitude": "30.711220274961008",
                "longitude": "76.80883286435652"
            },
            "altitude": "338.79944804746674",
            "distance": "1.6929336930113517"
        },
        {
            "time": "2025-08-29T18:59:41.972+05:30",
            "position": {
                "latitude": "30.711214378194637",
                "longitude": "76.80882726471805"
            },
            "altitude": "338.86629382948803",
            "distance": "2.5394005705635303"
        },
        {
            "time": "2025-08-29T18:59:46.972+05:30",
            "position": {
                "latitude": "30.711208481428265",
                "longitude": "76.80882166507958"
            },
            "altitude": "338.9331396115093",
            "distance": "3.3858674688133736"
        },
        {
            "time": "2025-08-29T18:59:51.972+05:30",
            "position": {
                "latitude": "30.71120258466189",
                "longitude": "76.8088160654411"
            },
            "altitude": "338.9999853935306",
            "distance": "4.2323343880668896"
        },
        {
            "time": "2025-08-29T18:59:56.972+05:30",
            "position": {
                "latitude": "30.71119668789552",
                "longitude": "76.80881046580264"
            },
            "altitude": "339.0668311755519",
            "distance": "5.078801327712053"
        },
        {
            "time": "2025-08-29T19:00:01.972+05:30",
            "position": {
                "latitude": "30.711190791129145",
                "longitude": "76.80880486616417"
            },
            "altitude": "339.1336769575732",
            "distance": "5.925268288360884"
        },
        {
            "time": "2025-08-29T19:10:00.000+05:30",
            "position": {
                "latitude": "30.711107057650768",
                "longitude": "76.80904655217809"
            },
            "altitude": "335.4329766322319",
            "distance": "139.84107835287915"
        },
        {
            "time": "2025-08-29T19:20:00.000+05:30",
            "position": {
                "latitude": "30.71117079628788",
                "longitude": "76.80856550863149"
            },
            "altitude": "335.78214792441577",
            "distance": "378.42674161727007"
        },
        {
            "time": "2025-08-29T19:30:00.000+05:30",
            "position": {
                "latitude": "30.710905097483127",
                "longitude": "76.80778762244194"
            },
            "altitude": "337.0753973202419",
            "distance": "580.6678233457901"
        },
        {
            "time": "2025-08-29T19:40:00.000+05:30",
            "position": {
                "latitude": "30.700463645499962",
                "longitude": "76.80303457042828"
            },
            "altitude": "330.5904762689024",
            "distance": "2068.1878485538678"
        },
        {
            "time": "2025-08-29T19:45:05.516+05:30",
            "position": {
                "latitude": "30.690149805833684",
                "longitude": "76.81466538667293"
            },
            "altitude": "325.9359058300033",
            "distance": "4446.878656324786"
        }
    ]
  };

  const currentData = selectedData === 'sample' ? sampleData : fullTrackData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">GPS Tracking Visualization</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedData('sample')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedData === 'sample'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Key Points
            </button>
            <button
              onClick={() => setSelectedData('full')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedData === 'full'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Detailed Route
            </button>
          </div>
        </div>
        <LeafletMap trackData={currentData} />
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Route Information</h4>
          <p className="text-sm text-gray-600">
            This biking activity was recorded in Chandigarh, India. The route shows a {(parseFloat(currentData.trackPoints[currentData.trackPoints.length - 1]?.distance || 0) / 1000).toFixed(2)} km journey 
            with {currentData.trackPoints.length} GPS tracking points. Use the buttons above to switch between key waypoints and the detailed route visualization.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GPSTrackingDemo;