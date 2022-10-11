<template>
    <div style="width: 60vh;">
        <p>
            Privatekey:<n-input type="text" v-model:value="Privatekey"/>
        </p>

        <n-space vertical>
            <n-select
            v-model:value="selectedNet"
            filterable
            placeholder="选择网络"
            :options="net_options"
            />
        </n-space>
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
            <n-select
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

            <n-button @click="send">
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
    let Privatekey = ref('')
    // let moduleId = ref('0x41422f5825e00c009a86ad42bc104228ac5f841313d8417ce69287e36776d1ee::TokenSwapScripts')
    let moduleId = ref('0x1::aptos_account')
    let selectedFunction = ref(null)
    let selectedNet = ref('testnet')
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
    async function send(){
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
            return
        }
        try{
            await client.waitForTransaction(transactionRes.hash);
        }catch(e){
            notify('error','交易失败','请检查输入参数或查看控制台信息')
            console.log(e)
            return
        }
        notify('success','交易成功',transactionRes.hash)
    }
</script>