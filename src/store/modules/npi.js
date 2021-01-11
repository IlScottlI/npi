import { set } from '@/utils/vuex'
import VueCookies from 'vue-cookies'
export default {
  namespaced: true,

  state: {
    npiData: [],
    npiMaster: [],
    npiConfigData: [],
    loading: true,
    Category: null,
    Material: null,
    CategoryBucket: 1,
    groupedBy: null,
    Action: null,
    Filters: [],
    BUs: [],
    Owner: null,
    SubSector: 'All',
    stack: [],
    npiBuckets: [{ id: 1, bucket: 'RED' }, { id: 3, bucket: 'ORANGE' }],
  },

  getters: {
    token: (state, getters, rootState, rootGetters, actions) => {
      return VueCookies.get('token')
    },
    categories: (state, getters, rootState, rootGetters, actions) => {
      function onlyUnique (value, index, self) {
        return self.indexOf(value) === index
      }
      const a = []
      const array = []
      let npiData
      if (state.Category) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      npiData.forEach(element => {
        a.push(element.hierarchyCategory)
      })
      var unique = a.filter(onlyUnique)
      unique.forEach(element => {
        // console.log(element)
        array.push(element)
      })
      return unique
    },

    owners: (state, getters, rootState, rootGetters, actions) => {
      function onlyUnique (value, index, self) {
        return self.indexOf(value) === index
      }
      const a = []
      const array = []
      let npiData
      if (state.Owner) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      npiData.forEach(element => {
        a.push(element.legalEntity)
      })
      var unique = a.filter(onlyUnique)
      unique.forEach(element => {
        array.push(element)
      })
      return unique
    },

    materials: (state, getters, rootState, rootGetters, actions) => {
      function onlyUnique (value, index, self) {
        return self.indexOf(value) === index
      }
      const a = []
      const array = []
      let npiData
      if (state.Material) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      npiData.forEach(element => {
        a.push(element.materialType)
      })
      var unique = a.filter(onlyUnique)
      unique.forEach(element => {
        array.push(element)
      })
      return unique
    },

    actions: (state, getters, rootState, rootGetters, actions) => {
      function onlyUnique (value, index, self) {
        return self.indexOf(value) === index
      }
      const a = []
      const array = []
      let npiData
      if (state.Action) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      npiData.forEach(element => {
        a.push(element.actionNote)
      })
      var unique = a.filter(onlyUnique)
      unique.forEach(element => {
        array.push(element)
      })
      return unique
    },

    ownerValues: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let i = 0
      let npiData
      if (state.Owner) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.owners.forEach(owner => {
        a = []
        npiData.forEach(element => {
          if (element.legalEntity === owner) {
            a.push(element.localStock)
          }
        })
        i = Math.round(a.reduce(myFunc))
        series.push(i)
      })

      return series
    },

    ownerValuesSummary: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let y = 0
      let x = ''
      let npiData
      if (state.Owner) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.owners.forEach(owner => {
        a = []
        npiData.forEach(element => {
          if (element.legalEntity === owner) {
            a.push(element.localStock)
          }
        })
        y = Math.round(a.reduce(myFunc).toFixed(2))
        if (owner.length < 1) {
          x = ''
        } else {
          x = owner
        }
        series.push({ x: x, y: y })
      })

      return series
    },

    actionValues: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let i = 0
      let npiData
      if (state.Action) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.actions.forEach(action => {
        a = []
        npiData.forEach(element => {
          if (element.actionNote === action) {
            a.push(element.localStock)
          }
        })
        i = Math.round(a.reduce(myFunc).toFixed(2))
        series.push(i)
      })

      return series
    },

    actionValuesSummary: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let y = 0
      let x = ''
      let npiData
      if (state.Action) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.actions.forEach(action => {
        a = []
        npiData.forEach(element => {
          if (element.actionNote === action) {
            a.push(element.localStock)
          }
        })
        y = Math.round(a.reduce(myFunc).toFixed(2))
        if (action.length < 1) {
          x = ''
        } else {
          x = action
        }
        series.push({ x: x, y: y })
      })

      return series
    },

    categoryValues: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let i = 0
      let npiData
      if (state.Category) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.categories.forEach(category => {
        a = []
        npiData.forEach(element => {
          if (element.hierarchyCategory === category) {
            a.push(element.localStock)
          }
        })
        i = Math.round(a.reduce(myFunc).toFixed(2))
        series.push(i)
      })

      return series
    },

    categorySummary: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      const summary = []
      let npiData
      if (state.Category) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.categories.forEach(category => {
        a = []
        npiData.forEach(element => {
          if (element.hierarchyCategory === category) {
            a.push(element.localStock)
          }
        })
        series.push(a.reduce(myFunc))
        function formatMoney (
          amount,
          decimalCount = 2,
          decimal = '.',
          thousands = ',',
        ) {
          try {
            decimalCount = Math.abs(decimalCount)
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount

            const negativeSign = amount < 0 ? '-' : ''

            const i = parseInt(
              (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
            ).toString()
            const j = i.length > 3 ? i.length % 3 : 0

            return (
              '$' +
              negativeSign +
              (j ? i.substr(0, j) + thousands : '') +
              i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
              (decimalCount
                ? decimal +
                Math.abs(amount - i)
                  .toFixed(decimalCount)
                  .slice(2)
                : '')
            )
          } catch (e) {
            console.log(e)
          }
        }
        summary.push({
          category: '<strong>' + category + '</strong>',
          value: formatMoney(a.reduce(myFunc)),
          count: a.length,
        })
      })

      return summary
    },
    materialValues: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      let i = 0
      let npiData
      if (state.Material) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.materials.forEach(material => {
        a = []
        npiData.forEach(element => {
          if (element.materialType === material) {
            a.push(element.inCategoryDateCounter)
          }
        })
        i = Math.round(a.reduce(myFunc) / a.length)
        series.push(i)
      })

      return series
    },

    materialSummary: (state, getters, rootState, rootGetters, actions) => {
      function myFunc (total, num) {
        return total + num
      }

      const series = []
      let a = []
      const summary = []
      let npiData
      if (state.Material) {
        npiData = state.npiData
      } else {
        npiData = getters.filteredData
      }
      getters.materials.forEach(material => {
        a = []
        npiData.forEach(element => {
          if (element.materialType === material) {
            a.push(element.inCategoryDateCounter)
          }
        })
        series.push(a.reduce(myFunc))
        function formatMoney (
          amount,
          decimalCount = 2,
          decimal = '.',
          thousands = '',
        ) {
          try {
            decimalCount = Math.abs(decimalCount)
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount

            const negativeSign = amount < 0 ? '-' : ''

            const i = parseInt(
              (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
            ).toString()
            const j = i.length > 3 ? i.length % 3 : 0

            return (
              '$' +
              negativeSign +
              (j ? i.substr(0, j) + thousands : ',') +
              i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
              (decimalCount
                ? decimal +
                Math.abs(amount - i)
                  .toFixed(decimalCount)
                  .slice(2)
                : '')
            )
          } catch (e) {
            console.log(e)
          }
        }
        const i = Math.round(a.reduce(myFunc) / a.length)
        summary.push({
          material: material,
          value: formatMoney(a.reduce(myFunc)),
          count: i,
        })
      })

      return summary
    },

    rootCauseData: (state, getters, rootState, rootGetters, actions) => {
      const arr = []
      state.npiConfigData.forEach(element => {
        if (element.dataSource === 'rootCause') {
          arr.push(element.JSON_Data)
        }
      })
      return arr
    },

    filteredData: (state, getters, rootState, rootGetters, actions) => {
      try {
        var arr = state.npiData.filter(item => {
          let res
          if (state.Material) {
            res = item.materialType === state.Material
          } else {
            res = item.materialType !== state.Material
          }
          return res
        })
        arr = arr.filter(item => {
          let res
          if (state.Category) {
            res = item.hierarchyCategory === state.Category
          } else {
            res = item.hierarchyCategory !== state.Category
          }
          return res
        })
        arr = arr.filter(item => {
          let res
          if (state.Action) {
            res = item.actionNote === state.Action
          } else {
            res = item.actionNote !== state.Action
          }
          return res
        })
      } catch (error) { }
      console.log(arr)
      return arr
    },
  },

  actions: {
    getNPIData: function ({ commit }) {
      commit('setLoading', true)
      fetch('https://tsp-appserver.na.pg.com/APIs/NPI/data.php', {
        method: 'GET',
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log(response)
          }
        })
        .then(response => {
          commit('setNPIData', response)
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },

    getNPIMaster: function ({ commit }) {
      fetch('https://tsp-appserver.na.pg.com/APIs/NPI/masterSheet.php', {
        method: 'GET',
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log(response)
          }
        })
        .then(response => {
          commit('setNPIMaster', response)
        })
        .catch(err => {
          console.log(err)
        })
    },

    updateNPI: function ({ commit, raw }) {
      console.log(raw, 'hello')
      commit('setLoading', true)
      fetch('https://tsp-appserver.na.pg.com/APIs/NPI/update.php', {
        method: 'POST',
        body: raw,
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log(response)
          }
        })
        .then(response => {
          commit('setLoading', false)
        })
        .catch(err => {
          console.log(err)
          commit('setLoading', false)
        })
    },
    getNPIBUs: function ({ commit }) {
      commit('setLoading', true)
      fetch('https://tsp-appserver.na.pg.com/APIs/NPI/BUs.php', {
        method: 'GET',
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log(response)
          }
        })
        .then(response => {
          commit('setNPIBUs', response)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getNPIConfigData: function ({ commit }) {
      commit('setLoading', true)
      fetch('https://tsp-appserver.na.pg.com/APIs/NPI/configData.php', {
        method: 'GET',
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            console.log(response)
          }
        })
        .then(response => {
          commit('setNPIConfigData', response)
        })
        .catch(err => {
          console.log(err)
        })
    },

  },

  mutations: {
    setNPIData: set('npiData'),
    setNPIMaster: set('npiMaster'),
    setNPIConfigData: set('npiConfigData'),
    setLoading: set('loading'),
    setCategory: set('Category'),
    setMaterial: set('Material'),
    setgroupedBy: set('groupedBy'),
    setAction: set('Action'),
    setFilters: set('Filters'),
    setNPIBUs: set('BUs'),
    setStack: set('stack'),
    setCategoryBucket: set('CategoryBucket'),
  },
}
