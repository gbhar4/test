/**
@module TCP Store Static Service Abstractors
*/
import {editJsonPopup} from 'util/testUtil/editJsonPopup';
import {COMPLETE_MONTH} from 'util/parseDate';
import {formatPhone} from 'util/formatPhone';

export function getTcpStoresAbstractor () {
  return TcpStoresStaticAbstractor;
}

const TcpStoresStaticAbstractor = {

  setFavoriteStore: function (storeLocationId) {
    return editJsonPopup('setFavoriteStore', { success: true }, { storeLocationId });
  },

  getStoreInfoByLocationId: function (args) {
    return editJsonPopup('getStoreInfoByLocationId', {
      'store': {
        'basicInfo': {
          'id': '1',
          'storeName': 'Union Square',
          'address': {
            'addressLine1': '36 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': formatPhone(2555292255) || '',
          'coordinates': {
            'lat': 40.720481,
            'long': -73.845743
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday'.toUpperCase() || '',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }, {
                'fromHour': '2017-03-16 17:21:49.994',
                'toHour': '2017-03-16 22:21:49.994'
              }],
              'isClosed': false
            },
            {
              'dayName': 'Tuesday'.toUpperCase() || '',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            },
            {
              'dayName': 'Wednesday'.toUpperCase() || '',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            },
            {
              'dayName': 'Black Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            },
            {
              'dayName': 'Thanksgiving',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            },
            {
              'dayName': 'Saturday'.toUpperCase() || '',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            },
            {
              'dayName': 'Sunday'.toUpperCase() || '',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }
          ],
          'holidayHours': []
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        }
      },
      'nearbyStores': [
        {
          'basicInfo': {
            'id': '2',
            'storeName': 'Union Square 2',
            'address': {
              'addressLine1': '37 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': formatPhone('2125292201') || '',
            'coordinates': {
              'lat': 34.487988848,
              'long': 45.784842457
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thursday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Friday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Saturday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ],
            'holidayHours': []
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        },
        {
          'basicInfo': {
            'id': '3',
            'storeName': 'Union Square 3',
            'address': {
              'addressLine1': '38 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': formatPhone('2125292201') || '',
            'coordinates': {
              'lat': 34.487988848,
              'long': 45.784842457
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thursday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Friday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Saturday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday'.toUpperCase() || '',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ],
            'holidayHours': []
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        },
        {
          'basicInfo': {
            'id': '4',
            'storeName': 'Union Square 4',
            'address': {
              'addressLine1': '39 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': formatPhone('2125292201') || '',
            'coordinates': {
              'lat': 34.487988848,
              'long': 45.784842457
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thursday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Friday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Saturday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ],
            'holidayHours': []
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        },
        {
          'basicInfo': {
            'id': '5',
            'storeName': 'Union Square 5',
            'address': {
              'addressLine1': '40 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': formatPhone('2125292201') || '',
            'coordinates': {
              'lat': 34.487988848,
              'long': 45.784842457
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thursday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Friday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Saturday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ],
            'holidayHours': []
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        },
        {
          'basicInfo': {
            'id': '6',
            'storeName': 'Union Square 6',
            'address': {
              'addressLine1': '41 Union Sq. East',
              'city': 'New York',
              'state': 'NY',
              'zipCode': '10003'
            },
            'phone': formatPhone('2125292201') || '',
            'coordinates': {
              'lat': 34.487988848,
              'long': 45.784842457
            }
          },
          'hours': {
            'regularHours': [
              {
                'dayName': 'Monday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Tuesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Wednesday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Thursday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Friday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Saturday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              },
              {
                'dayName': 'Sunday',
                'openIntervals': [{
                  'fromHour': '2017-03-16 11:21:49.994',
                  'toHour': '2017-03-16 16:21:49.994',
                }],
                'isClosed': false
              }
            ],
            'holidayHours': []
          },
          'features': {
            'storeType': 'Retail Store',
            'mallType': 'Enclosed Mall',
            'entranceType': 'Internal',
            'isBopisAvailable': true
          }
        }
      ]
    });
  },

  getFullStoresList: function () {
    return editJsonPopup('getFullStoresList', {
      usStores: [
        {
          'id': 'AL',
          'displayName': 'Alabama',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }, {
          'id': 'AR',
          'displayName': 'Arkansas',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }, {
          'id': 'CO',
          'displayName': 'Connecticut',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }, {
          'id': 'NY',
          'displayName': 'New York',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'New York',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }, {
          'id': 'MI',
          'displayName': 'Miami',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }
      ],
      caStores: [
        {
          'id': 'AB',
          'displayName': 'Alberta',
          'storesList': [
            {
              'basicInfo': {
                'id': '1',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '2',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '3',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '4',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '5',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '6',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            },
            {
              'basicInfo': {
                'id': '7',
                'storeName': 'Pinnacle at Tutweiler',
                'address': {
                  'addressLine1': '5012 Pinnacle Sqd',
                  'city': 'birmingham',
                  'state': 'AL',
                  'zipCode': '35235'
                },
                'phone': '(205) 655-9210'
              }
            }
          ]
        }
      ]
    });
  },

  getStoresByLatLng: function (latLng, limit, radius) {
    return editJsonPopup('getStoresByLatLng', [
      {
        'basicInfo': {
          'id': '2',
          'storeName': 'Union Square nn',
          'address': {
            'addressLine1': '37 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 40.735631,
            'long': -73.989695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Columbus Day',
              'openIntervals': [{
                'fromHour': '2017-03-16 08:00:49.994',
                'toHour': '2017-03-16 11:00:49.994'
              }, {
                'fromHour': '2017-03-16 13:00:49.994',
                'toHour': '2017-03-16 23:00:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'TUESDAY',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-17 04:21:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'Thanksgiving',
              'openIntervals': [{
                'fromHour': '2017-03-17 08:21:49.994',
                'toHour': '2017-03-17 16:21:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'THURSDAY',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'FRIDAY',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'SATURDAY',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            }, {
              'dayName': 'SUNDAY',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994'
              }],
              'isClosed': false
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Outlet',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        }
      }], {latLng, limit, radius}).then((r) => {
        /* for (var nStore = 0; nStore < r.length; nStore++) {
          r[nStore].hours.todayOpenTo = new Date(r[nStore].hours.todayOpenTo);
          r[nStore].hours.regularHours = r[nStore].hours.regularHours.map((dayHours) => {
            dayHours.fromHour = new Date(dayHours.fromHour);
            dayHours.toHour = new Date(dayHours.toHour);
            return dayHours;
          });
        }
        */
        return r;
      });
  },

  getFavoriteStore: function () {
    return editJsonPopup('getFavoriteStore', {
      'basicInfo': {
        'id': '7',
        'storeName': 'Union Square 7',
        'address': {
          'addressLine1': '41 Union Sq. East',
          'city': 'New York',
          'state': 'NY',
          'zipCode': '10003'
        },
        'phone': '(212) 529-2201',
        'coordinates': {
          'lat': 41.145631,
          'long': -73.899695
        }
      },
      'hours': {
        'regularHours': [
          {
            'dayName': 'Monday',
            'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
            'isClosed': false
          }, {
            'dayName': 'Tuesday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': false
          }, {
            'dayName': 'Wednesday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': false
          }, {
            'dayName': 'Thursday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': false
          }, {
            'dayName': 'Friday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': false
          }, {
            'dayName': 'Saturday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': false
          }, {
            'dayName': 'Sunday',
            'openIntervals': [{
              'fromHour': '2017-03-16 11:21:49.994',
              'toHour': '2017-03-16 16:21:49.994',
            }],
            'isClosed': true
          }
        ],
        'holidayHours': [ ]
      },
      'features': {
        'storeType': 'Retail Store',
        'mallType': 'Enclosed Mall',
        'entranceType': 'Internal',
        'isBopisAvailable': true
      }
    });
  },

  getStoresPlusInventorybyLatLng: function (skuId, quantity, distance, lat, lng, country) {
    return editJsonPopup('getStoresPlusInventorybyLatLng', [
      {
        'basicInfo': {
          'id': '7',
          'storeName': 'Union Square 7',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'OK',
          quantity: 10
        }
      },
      {
        'basicInfo': {
          'id': '9',
          'storeName': 'Union Square 9',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': []
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'OK',
          quantity: 10
        }
      },
      {
        'basicInfo': {
          'id': '10',
          'storeName': 'Union Square 10',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'OK',
          quantity: 10
        }
      },
      {
        'basicInfo': {
          'id': '11',
          'storeName': 'Union Square 11',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'UNAVAILABLE',
          quantity: 10
        }
      },
      {
        'basicInfo': {
          'id': '12',
          'storeName': 'Union Square 12',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'UNAVAILABLE',
          quantity: 10
        }
      }
    ], {skuId, quantity, distance, lat, lng, country});
  },

  getBopisStoresInCartPlusInventory: function (skuId, quantity) {
    return editJsonPopup('getBopisStoresInCartPlusInventory', [
      {
        'basicInfo': {
          'id': '7',
          'storeName': 'Union Square 7',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {
          skuId: skuId,
          status: 'OK',
          quantity: 10
        }
      }
    ], {skuId, quantity});
  },

  getBopisStoresInCart: function () {
    return editJsonPopup('getBopisStoresInCart', [
      {
        'basicInfo': {
          'id': '7',
          'storeName': 'Union Square 7',
          'address': {
            'addressLine1': '41 Union Sq. East',
            'city': 'New York',
            'state': 'NY',
            'zipCode': '10003'
          },
          'phone': '(212) 529-2201',
          'coordinates': {
            'lat': 41.145631,
            'long': -73.899695
          }
        },
        'hours': {
          'regularHours': [
            {
              'dayName': 'Monday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Tuesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Wednesday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Thursday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Friday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Saturday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': false
            }, {
              'dayName': 'Sunday',
              'openIntervals': [{
                'fromHour': '2017-03-16 11:21:49.994',
                'toHour': '2017-03-16 16:21:49.994',
              }],
              'isClosed': true
            }
          ],
          'holidayHours': [ ]
        },
        'features': {
          'storeType': 'Retail Store',
          'mallType': 'Enclosed Mall',
          'entranceType': 'Internal',
          'isBopisAvailable': true
        },
        'productAvailability': {}
      }
    ]);
  }

};
