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
    dialog: null,
    closePopup: null,
    viewToast: false,
    selectedRowsData: [],
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
    selectedRowObject: {},
    oldValues: {},
    pager: 'pager',
    pageSizes: [5, 10, 20, 100],
    editButtons: ['edit'],
    filterBuilderPopupPosition: {
      of: window,
      at: 'top',
      my: 'top',
      offset: { y: 10 },
    },
    activeTab: 0,
    zoomLevel: localStorage.getItem('zoomLevel'),
    pendingSteamGrid: () => {},
    pendingApprovalGrid: () => {},
  },

  getters: {
    zoomLevel: (state, getters, rootState, rootGetters, actions) => {
      return localStorage.getItem('zoomLevel')
    },
  },

  mutations: {
    setDrawer: set('drawer'),
    toggleDrawer: toggle('drawer'),
    toggleBucketDialog: toggle('bucketDialog'),
    setSelectedItem: set('selectedItem'),
    setDialog: set('dialog'),
    setViewToast: set('viewToast'),
    setToastOptions: set('toastOptions'),
    setSelectedRowsData: set('selectedRowsData'),
    setSelectedRowObject: set('selectedRowObject'),
    setOldValues: set('oldValues'),
    setPager: set('pager'),
    setActiveTab: set('activeTab'),
    setZoomLevel: set('zoomLevel'),
    setPendingSteamGrid: set('pendingSteamGrid'),
    setPendingApprovalGrid: set('pendingApprovalGrid'),
  },
}
