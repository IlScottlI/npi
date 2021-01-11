import { set, toggle } from '@/utils/vuex'

export default {
  namespaced: true,

  state: {
    links: [
      ['/', 'Overview'],
      ['/investigate', 'Investigate'],
      ['/scrap', 'Scrap'],
      ['/rework', 'Rework'],
      ['/donate', 'Donate'],
      ['/return', 'Return to Vendor'],
      ['/release', 'Release'],
      ['/unpickable', 'Unpickable'],
    ],
    drawer: null,
    bucketDialog: null,
    selectedItem: {},
    dialogCLose: null,
    closePopup: null,
    viewToast: false,
    toastOptions: { text: 'Update Success', type: 'success', time: 1000 },
    buckets: [
      { ID: '1', Name: 'Investigate' },
      { ID: '2', Name: 'Scrap' },
      { ID: '3', Name: 'Rework' },
      { ID: '4', Name: 'Donate' },
      { ID: '5', Name: 'Return to Vendor' },
      { ID: '6', Name: 'Release' },
      { ID: '7', Name: 'Unpickable' },
    ],
    scrapTypes: ['', 'Heritage', 'Awesome'],
  },

  mutations: {
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    toggleBucketDialog: toggle('bucketDialog'),
    setSelectedItem: set('selectedItem'),
    setdialogCLose: set('dialogCLose'),
    setViewToast: set('viewToast'),
    setToastOptions: set('toastOptions'),
  },
}
