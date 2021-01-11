<template>
  <section>
    <xlsx-workbook>
      <xlsx-sheet
        v-for="sheet in sheets"
        :key="sheet.name"
        :collection="sheet.data"
        :sheet-name="sheet.name"
      />
      <xlsx-download>
        <button>Download</button>
      </xlsx-download>
    </xlsx-workbook>
  </section>
</template>

<script>
  import XlsxWorkbook from './components/XlsxWorkbook'
  import XlsxSheet from './components/XlsxSheet'
  import XlsxDownload from './components/XlsxDownload'

  export default {
    components: {
      XlsxWorkbook,
      XlsxSheet,
      XlsxDownload,
    },
    data () {
      return {
        sheets: [{ name: 'SheetOne', data: [{ c: 2 }] }],
      }
    },
  }
</script>
