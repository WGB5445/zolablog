<template>
   <div>
        <p>
        连接钱包：<n-button @click="connect_wallet" >{{i}}</n-button>
        </p> 
        <p>
            输入：<input>
        </p>
        <p>
            
            <n-button>添加</n-button>
        </p>
   </div>
   
</template>

<script setup>
    import { connect, is_install} from '../../util/wallet'
    import { ref } from 'vue';
    const i = is_install() ? ref('Connect'):'Not Installed MetaMask'
    async function connect_wallet(){
        try{
            if(!is_install()){
                i.value = 'Not Installed MetaMask';
                return
            }
        i.value = await connect()
      }catch(e){
        console.log(e)
      }
    }
</script>