<template>
  <div>
    <vue-file-agent
      v-model="fileRecords"
      :upload-url="'https://www.mocky.io/v2/5d4fb20b3000005c111099e3'"
      :upload-headers="{}"
      :multiple="true"
      :deletable="true"
      :meta="true"
      :accept="'image/*,video/*,.pdf,.zip'"
      :max-size="'14MB'"
      :max-files="8"
      :help-text="'Select files'"
      :error-text="{
        type: 'Please select images, videos, pdf or zip files',
        size: 'You selected a larger file!',
      }"
      :thumbnail-size="120"
      :theme="'list'"
    />
  </div>
</template>
<script>
  import VueFileAgent from 'vue-file-agent'
  export default {
    // ...
    components: {
      VueFileAgent,
    },
    data: function () {
      return {
        fileRecords: [
          {
            name: 'Some Invalid.exe',
            size: 8165824,
            type: 'application/vnd.microsoft.portable-executable',
            ext: 'exe',
          },
          {
            name: 'Golf.mp4',
            lastModified: 1576563996233,
            sizeText: '549 KB',
            size: 561813,
            type: 'video/mp4',
            ext: 'mp4',
            dimensions: {
              width: 640,
              height: 360,
            },
            url: 'https://safrazik.com/vue-file-agent/website/assets/files/Golf.mp4',
            videoThumbnail: 'https://safrazik.com/vue-file-agent/website/assets/files/Golf-thumb.jpg',
            imageColor: [66, 62, 45],
          },
          {
            name: 'Some Large File.zip',
            size: 25165824, // 24 MB
            type: 'application/zip',
            ext: 'zip',
          },
        ],
      }
    },
    // ...
  }
</script>
