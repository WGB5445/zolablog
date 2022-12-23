<template>
    <div style="width: 60vh;">

      <div>

        <n-button @click="connect">
          链接钱包
        </n-button>
        <p></p>
        <n-button @click="wallet_send('Sw33t Friends')">
          mint 1 个 Body
        </n-button>
        <p></p>
        <n-button @click="wallet_send('Sw33t Friends - Eyes')">
          mint 1 个 Eyes
        </n-button>
        <p></p>
        <n-button @click="wallet_send('Sw33t Friends - Tail')">
          mint 1 个 Tail
        </n-button>
        <p></p>
        <n-button @click="wallet_send('Sw33t Friends - Ear')">
          mint 1 个 Ears
        </n-button>
        </div>
      </div>

</template>
<script setup >
    import { ref } from 'vue';
    import { useNotification } from "naive-ui";

    const sw33t_address = '0x2f46fd0be3811c1280b63a1c07a4eead16b520b178e11ceedca591d1f9299c5f'

    const notification = useNotification();
    let wallets = ref({
      "Petra": window.petra,
    })
    let send_loading = ref(false)
    function notify(type,content, meta) {
        notification[type]({
          content: content,
          meta: meta,
          duration: 2500,
          keepAliveOnHover: true
        });
    }
    async function wallet_send(name){
      send_loading.value = true
      const payload = {
        type: "entry_function_payload",
        function: `${sw33t_address}::${'sw33t_mint'}::${'mint_reserve_by_admin'}`,
        type_arguments: [],
        arguments: [
            '0x1',
            name,
            1
        ],
      };
      notify('info','调用钱包','交易请求中')
      try{
        let status = await wallets.value['Petra'].signAndSubmitTransaction(payload)
        notify('success','交易已发送',status.hash)
      }catch (e){
        console.log(e.toString())
        if(e.toString() == 'Rejected: The user rejected the request'){
          notify('info','交易已取消')
        }else{

        }
      }
      send_loading.value = false
    }
    async function connect(){
      if(wallets.value['Petra'] == null){
        notify('error','连接钱包失败','Petra'+'未安装')
        return
      }

      if (!await wallets.value['Petra'].isConnected()) {

        notify('info','链接钱包','链接'+'Petra')

      };
      let connect_status = await wallets.value['Petra'].connect()
      selectedwallet_account.value = connect_status.address
      let network = await wallets.value['Petra'].network()
      selectedNet.value = network.toString().toLowerCase()
      notify('success','链接钱包','Petra'+'已连接')
    }

</script>