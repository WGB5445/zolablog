<template>
  <n-notification-provider>
      <n-layout style="height: 90vh">
        <n-layout-header style="height: 64px; padding: 24px" bordered>
          
        <n-grid :x-gap="12" :cols="2">
        <n-grid-item> 
          <div >
            Web3 工具合集
          </div>
        </n-grid-item>
        </n-grid>
        </n-layout-header>
        <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>
          <n-layout-sider
            collapse-mode="width"
            :collapsed-width="120"
            :width="240"
            show-trigger="arrow-circle"
            content-style="padding: 24px;"
            :native-scrollbar="false"
            bordered
          >
          
            <!-- <n-button id="setEVM_Network" @click="click">添加EVM网络</n-button>
            <n-button id="setAptos_get_address" @click="click">计算Aptos地址</n-button> -->
            <n-button id="Aptos_send_txn" @click="click">Aptos 交易发送</n-button>
          </n-layout-sider>
          <n-layout content-style="padding: 24px;" :native-scrollbar="false">
            <component :is="current"></component>
            <!-- <setEVM_Network/>
            <setAptos_get_address/> -->
          </n-layout>
        </n-layout>
        <n-layout-footer
          position="absolute"
          style="height: 64px; padding: 24px"
          bordered
        >
        <n-space>
          <n-tag :bordered="false">
            不霁何虹
          </n-tag>
          <n-tag :bordered="false" type="success">
            2022
          </n-tag>
          
        </n-space>
          
        </n-layout-footer>
      </n-layout>
  </n-notification-provider>
</template>


<script setup>
  import { ref , shallowRef} from 'vue';
  import setAptos_get_address from '../com/setAptos_get_address.vue'
  import setEVM_Network from '../com/setEVM_Network.vue'
  import Aptos_send_txn from '../com/Aptos_send_txn.vue'
  const current = shallowRef(Aptos_send_txn)
  let components = {
    'setEVM_Network':setEVM_Network,
    'setAptos_get_address':setAptos_get_address,
    'Aptos_send_txn':Aptos_send_txn
  }; 
  function click(event){
    current.value = components[event.currentTarget.id]
  }

</script>