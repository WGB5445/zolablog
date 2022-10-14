<template>
    <div style="width: 60vh;">

      <div>
        <n-switch  v-model:value="WalletAble" >
          <template #checked>
            Wallet
          </template>
          <template #unchecked>
            Privatekey
          </template>
        </n-switch>

        <div v-if="WalletAble">
          <n-space vertical>
            选择钱包: <n-select
              v-model:value="selectedWallet"
              filterable
              placeholder="选择钱包"
              :options="wallet_options"
          />
          </n-space>
          <n-button @click="connect">
            链接钱包
          </n-button>
        </div>
        <div v-else>
          <p>
              Privatekey:<n-input type="text" v-model:value="Privatekey"/>
          </p>
          <n-space vertical>
            选择网络: <n-select
                v-model:value="selectedNet"
                filterable
                placeholder="选择网络"
                :options="net_options"
            />
          </n-space>
        </div>
      </div>

        <p>
            Module:<n-input type="text" v-model:value="moduleId"/>
            <n-button @click="get_functions">
                <n-spin v-if="get_loading" size="small" />
                <spin v-else>
                    解析
                </spin>
                
            </n-button>
        </p>

        <n-space vertical>
          Function:  <n-select
            v-model:value="selectedFunction"
            filterable
            placeholder="选择 Function"
            :options="functions_options"
            />
        </n-space>

        <div v-if="functions.length > 0">
            <div  v-for="(param , index) in functions[parseInt(selectedFunction)].generic_type_params">     
                
                {{`type_arg ${index}`}} <n-input type='text' v-model:value='functions[parseInt(selectedFunction)].type_args[index]'/>
            </div>

            <div v-for="(param , index) in functions[parseInt(selectedFunction)].params">     
                <div v-if="!(param == '&signer' || param == 'signer')">
                    {{param}} <n-input type='text' v-model:value='functions[parseInt(selectedFunction)].args[index]'/>
                </div>
            </div>

          <n-button v-if="WalletAble" @click="wallet_send">
            <n-spin v-if="send_loading" size="small" />
            <spin v-else>
              send
            </spin>
          </n-button>
            <n-button v-else @click="privatekey_send">
                <n-spin v-if="send_loading" size="small" />
                <spin v-else>
                    send
                </spin>
            </n-button>

        </div>

    </div>

</template>
<script setup >
    import { ref } from 'vue';
    import axios from "axios";
    import { AptosClient,AptosAccount } from "aptos";
    import {Buffer} from "buffer/"
    import { useNotification } from "naive-ui";

    const notification = useNotification();
    let WalletAble = ref(true)
    let Privatekey = ref('')
    // let moduleId = ref('0x41422f5825e00c009a86ad42bc104228ac5f841313d8417ce69287e36776d1ee::TokenSwapScripts')
    let moduleId = ref('0x1::aptos_account')
    let selectedFunction = ref(null)
    let selectedNet = ref('testnet')
    let selectedWallet = ref('Petra')
    let selectedwallet_account = ref("")
    let wallet_options = ref([
      {
        label: 'Petra',
        value: 'Petra'
      },
    ])
    let net_options = ref([
        {
          label: 'Testnet',
          value: 'testnet',
          selected: true
        },
        {
          label: 'Devnet',
          value: 'devnet'
        },
    ])
    let functions_options = ref([]);
    let functions = ref([]);
    let data = ref(null);
    let wallets = ref({
      "Petra": window.petra,
    })
    let get_loading = ref(false)
    let send_loading = ref(false)
    function notify(type,content, meta) {
        notification[type]({
          content: content,
          meta: meta,
          duration: 2500,
          keepAliveOnHover: true
        });
    }
    function get_functions() {
        notify('info','解析中',moduleId.value)
       let vec = moduleId.value.split("::")
       let address = vec[0]
       let module_name = vec[1]
       let url = `https://fullnode.${selectedNet.value}.aptoslabs.com/v1/accounts/${address}/module/${module_name}`
       get_loading.value = true
       axios.get(url)
        .then(function (response) {
            // 处理成功情况
            let i = response.data.abi.exposed_functions
            functions.value = i.filter((item,index)=>{
                return (item.is_entry == true && item.visibility == "public")
            })
            let myfunctions_options = [];
            functions.value.forEach((value, key) => {
                value.type_args = Array (value.generic_type_params.length)
                value.args = Array(value.params.length)
                myfunctions_options.push({ 
                    label: functions.value[key].name,
                    value: String(key)
                })
            })
            functions_options.value = myfunctions_options
            selectedFunction.value = myfunctions_options[0].value
            data.value = response.data
            console.log(response.data)
            notify('success','解析成功',moduleId.value)
        })
        .catch(function (error) {
            // 处理错误情况
            console.log(error);
            notify('error','解析失败',moduleId.value)
        })
        .then(function () {
            // 总是会执行
            get_loading.value = false
        });
    }
    async function privatekey_send(){
        send_loading.value = true
        const client = new AptosClient(`https://fullnode.${selectedNet.value}.aptoslabs.com`);
        let args = Array();
        let type_args = Array();
        functions.value[parseInt(selectedFunction.value)].generic_type_params.forEach((item, index)=>{
            type_args.push(functions.value[parseInt(selectedFunction.value)].type_args[index])
        })

        functions.value[parseInt(selectedFunction.value)].params.forEach((item, index)=>{
            if (!(item == '&signer' || item == 'signer')){
                if(item == 'u8'|| item == 'u64'|| item == 'u128')
                    args.push(parseInt(functions.value[parseInt(selectedFunction.value)].args[index]))
                else
                    args.push(functions.value[parseInt(selectedFunction.value)].args[index])
            }
        })
        const payload = {
            type: "entry_function_payload",
            function: `${data.value.abi.address}::${data.value.abi.name}::${functions.value[parseInt(selectedFunction.value)].name}`,
            type_arguments: type_args,
            arguments: args,
        };
        let key = ""
        
        if(Privatekey.value.startsWith('0x'))
            key  = Privatekey.value.substring(2)
        else    
            key = Privatekey.value
        let alice = null
        try{
            alice = new AptosAccount(Buffer.from(key,'hex'));
        }catch(e){
            notify('error','PrivateKey 错误','请检查输入的私钥的格式')
            send_loading.value = false
            return
        }
        let transactionRes = null;
        try{   
            const txnRequest = await client.generateTransaction(alice.address(), payload);
            const signedTxn = await client.signTransaction(alice, txnRequest);
            transactionRes = await client.submitTransaction(signedTxn);
            notify('info','交易发送',transactionRes.hash)
        }catch(e){
            notify('error','发送错误','请检查输入参数与网络环境')
            send_loading.value = false
            return
        }
        try{
            await client.waitForTransaction(transactionRes.hash);
        }catch(e){
            notify('error','交易失败','请检查输入参数或查看控制台信息')
            console.log(e)
            send_loading.value = false
            return
        }
        notify('success','交易成功',transactionRes.hash)
        send_loading.value = false
    }
    async function wallet_send(){
      let connect_status = await wallets.value[selectedWallet.value].connect()
      selectedwallet_account.value = connect_status.address
      let network = await wallets.value[selectedWallet.value].network()
      selectedNet.value = network.toString().toLowerCase()

      send_loading.value = true
      let args = Array();
      let type_args = Array();
      functions.value[parseInt(selectedFunction.value)].generic_type_params.forEach((item, index)=>{
        type_args.push(functions.value[parseInt(selectedFunction.value)].type_args[index])
      })

      functions.value[parseInt(selectedFunction.value)].params.forEach((item, index)=>{
        if (!(item == '&signer' || item == 'signer')){
          if(item == 'u8'|| item == 'u64'|| item == 'u128')
            args.push(parseInt(functions.value[parseInt(selectedFunction.value)].args[index]))
          else
            args.push(functions.value[parseInt(selectedFunction.value)].args[index])
        }
      })
      const payload = {
        type: "entry_function_payload",
        function: `${data.value.abi.address}::${data.value.abi.name}::${functions.value[parseInt(selectedFunction.value)].name}`,
        type_arguments: type_args,
        arguments: args,
      };
      notify('info','调用钱包','交易请求中')
      try{
        let status = await wallets.value[selectedWallet.value].signAndSubmitTransaction(payload)
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
      if(wallets.value[selectedWallet.value] == null){
        notify('error','连接钱包失败',selectedWallet.value+'未安装')
        return
      }

      if (!await wallets.value[selectedWallet.value].isConnected()) {

        notify('info','链接钱包','链接'+selectedWallet.value)

      };
      let connect_status = await wallets.value[selectedWallet.value].connect()
      selectedwallet_account.value = connect_status.address
      let network = await wallets.value[selectedWallet.value].network()
      selectedNet.value = network.toString().toLowerCase()
      notify('success','链接钱包',selectedWallet.value+'已连接')
    }

</script>