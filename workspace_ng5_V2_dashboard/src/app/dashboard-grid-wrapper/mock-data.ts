import { IConfig } from "smart-cards-shared";
import { dashboardISection } from "@vsDashboardInterface";

export const sections: dashboardISection[] = [
  // ** TRANSACTION DOCUMENTS
  {
    viewId: '',
    title: "Test",
    api: {},
    subheaderConfig: { HasUserVisionEditActivity: true, showDashboardOnEmptyWidget: true },
    config:
    {
      container: {
        manifestId: 'SmartCardsContainer',
        componentId: 'SmartCardsContainerComponent',
        classId: 'DA4IBwgKBgUIBQYKBAUKBw'
      },
      layout: {
        manifestId: 'SmartGridstackLayout',
        componentId: 'SmartGridstackLayoutComponent',
        classId: 'CQMCBAgHBwgLDQMDBAEBCQ',
        config: {
          handle: '.drag-handle',
          float: false,
          animate: true,
          verticalMargin: 10
        },
        classes: ['layout-wrapper']
      },
      placeholder: {
        manifestId: 'SmartCardsPlaceholder',
        componentId: 'SmartCardsPlaceholderComponent',
        classId: 'CwICCQYCCAsDDgIPBAsDBg',
        classes: ['placeholder-wrapper']
      },
      cards: [
        {
          manifestId: 'DashboardCard',
          componentId: 'DashboardCardComponent',
          classId: 'CQUNCg0KAwsOBQcGBA4JAQ',
          cardId: 'a513825d1-a0ea-415e-8584-56fa1c9fd7ec',
          cardTitle: 'Transaction & Event Metrics',
          isExpandedGraph: true,
          showEdit: false,
          isRemoved: false,
          breadCrumb: [],
          sort: {
            items: [{
              'name': 'Saving',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Spend',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Analysis',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            }
            ],
            isActive: false,
            showSort: false,
            doneBtnConfig: {
              title: "Apply",
              flat: true,
              disable: true
            }
          },
          layoutItemConfig: {
            gridstackPosition: {
              x: 0,
              y: 0,
              width: 12,
              height: 5,
              minWidth: 1,
              minHeight: 5
            }
          },
          config: {
            chart: {
              type: 'column'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ]
            },
            yAxis: {
              labels: {
                x: -15
              },
              title: {
                text: 'Items'
              }
            },
            series: [
              {
                name: 'Sales',
                data: [434, 523, 345, 785, 565, 843, 726, 590, 665, 434, 312, 432]
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    xAxis: {
                      labels: {
                        formatter: function () {
                          return this.value.charAt(0);
                        }
                      }
                    },
                    yAxis: {
                      labels: {
                        align: 'left',
                        x: 0,
                        y: -2
                      },
                      title: {
                        text: ''
                      }
                    }
                  }
                }
              ]
            },
            sliderConfig: [
              {
                name: "Category Spend",
                min: -1000,
                max: 90000,
                range: { from: -1000, to: 90000 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              },
              {
                name: "Supplier Count",
                min: 1,
                max: 100,
                range: { from: 1, to: 100 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              }
            ]
          },
        },
        {
          manifestId: 'DashboardCard',
          componentId: 'DashboardCardComponent',
          classId: 'CQUNCg0KAwsOBQcGBA5FSW',
          cardId: 'a98edbb68-0307-40a3-b63a-ecf3e1c505df',
          cardTitle: 'Documents',
          isExpandedGraph: false,
          showEdit: false,
          isRemoved: false,
          breadCrumb: [],
          sort: {
            items: [{
              'name': 'Saving',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Spend',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Analysis',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            }
            ],
            isActive: false,
            showSort: false,
            doneBtnConfig: {
              title: "Apply",
              flat: true,
              disable: true
            }
          },
          layoutItemConfig: {
            gridstackPosition: {
              x: 6,
              y: 0,
              width: 6,
              height: 5,
              minWidth: 1,
              minHeight: 5
            }
          },
          config: {
            chart: {
              type: 'pie'
            },
            title: {
              text: 'Test'
            },
            xAxis: {
              categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
              title: {
                text: 'Fruit eaten'
              }
            },
            series: [
              {
                name: 'Nick',
                data: [1, 0, 4]
              },
              {
                name: 'John',
                data: [5, 7, 3]
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    xAxis: {
                      labels: {
                        formatter: function () {
                          return this.value.charAt(0);
                        }
                      }
                    },
                    yAxis: {
                      labels: {
                        align: 'left',
                        x: 0,
                        y: -2
                      },
                      title: {
                        text: ''
                      }
                    }
                  }
                }
              ]
            },
            sliderConfig: [
              {
                name: "Category Spend",
                min: -1000,
                max: 90000,
                range: { from: -1000, to: 90000 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              },
              {
                name: "Supplier Count",
                min: 1,
                max: 100,
                range: { from: 1, to: 100 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              }
            ]

          }
        },
        {
          manifestId: 'DashboardCard',
          componentId: 'DashboardCardComponent',
          classId: 'CQUNCg0KAwsOBQcGBA4JAQ',
          cardId: 'a454b0531-8be5-4ba1-9c96-ce4281f1f401',
          cardTitle: 'Top 5 Interface Exceptions',
          isExpandedGraph: false,
          showEdit: false,
          isRemoved: false,
          breadCrumb: [],
          sort: {
            items: [{
              'name': 'Saving',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Spend',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Analysis',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            }
            ],
            isActive: false,
            showSort: false,
            doneBtnConfig: {
              title: "Apply",
              flat: true,
              disable: true
            }
          },
          layoutItemConfig: {
            gridstackPosition: {
              x: 0,
              y: 7,
              width: 6,
              height: 5,
              minWidth: 1,
              minHeight: 5
            }
          },
          config: {
            chart: {
              type: 'column'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: ['Apples', 'Bananas', 'Oranges']
            },
            yAxis: {
              title: {
                text: 'Fruit eaten'
              }
            },
            series: [
              {
                name: 'Nick',
                data: [1, 0, 4]
              },
              {
                name: 'John',
                data: [5, 7, 3]
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    xAxis: {
                      labels: {
                        formatter: function () {
                          return this.value.charAt(0);
                        }
                      }
                    },
                    yAxis: {
                      labels: {
                        align: 'left',
                        x: 0,
                        y: -2
                      },
                      title: {
                        text: ''
                      }
                    }
                  }
                }
              ]
            },
            sliderConfig: [
              {
                name: "Category Spend",
                min: -1000,
                max: 90000,
                range: { from: -1000, to: 90000 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              },
              {
                name: "Supplier Count",
                min: 1,
                max: 100,
                range: { from: 1, to: 100 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              }
            ]
          }
        },
        {
          manifestId: 'DashboardCard',
          componentId: 'DashboardCardComponent',
          classId: 'CQUNCg0KAwsOBQcGBA5FSW',
          cardId: 'a34524a5a-bb2b-4859-8b0c-c3440418b08a',
          cardTitle: 'Spend and Savings by Region',
          isExpandedGraph: false,
          showEdit: false,
          isRemoved: false,
          breadCrumb: [],
          sort: {
            items: [{
              'name': 'Saving',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Spend',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            },
            {
              'name': 'Analysis',
              'sortas': 'asc_desc',
              'isActive': false,
              'tooltipConfig': {
                message: 'Sort by Ascending',
                position: 'bottom'
              }
            }
            ],
            isActive: false,
            showSort: false,
            doneBtnConfig: {
              title: "Apply",
              flat: true,
              disable: true
            }
          },
          layoutItemConfig: {
            gridstackPosition: {
              x: 6,
              y: 7,
              width: 6,
              height: 5,
              minWidth: 1,
              minHeight: 5
            }
          },
          config: {
            chart: {
              type: 'column'
            },
            title: {
              text: ''
            },
            xAxis: {
              categories: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
              ]
            },
            yAxis: {
              labels: {
                x: -15
              },
              title: {
                text: 'Items'
              }
            },
            series: [
              {
                name: 'Sales',
                data: [434, 523, 345, 785, 565, 843, 726, 590, 665, 434, 312, 432]
              }
            ],
            responsive: {
              rules: [
                {
                  condition: {
                    maxWidth: 500
                  },
                  // Make the labels less space demanding on mobile
                  chartOptions: {
                    xAxis: {
                      labels: {
                        formatter: function () {
                          return this.value.charAt(0);
                        }
                      }
                    },
                    yAxis: {
                      labels: {
                        align: 'left',
                        x: 0,
                        y: -2
                      },
                      title: {
                        text: ''
                      }
                    }
                  }
                }
              ]
            },
            sliderConfig: [
              {
                name: "Category Spend",
                min: -1000,
                max: 90000,
                range: { from: -1000, to: 90000 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              },
              {
                name: "Supplier Count",
                min: 1,
                max: 100,
                range: { from: 1, to: 100 },
                ConfigFrom: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'from',
                  tabIndex: 2,
                },
                ConfigTo: {
                  label: '',
                  isMandatory: true,
                  disabled: false,
                  data: 'to',
                  tabIndex: 2,
                }
              }
            ]
          }
        }
      ]
    }
  }
];

