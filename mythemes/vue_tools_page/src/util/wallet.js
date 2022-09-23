let web3 = window.Web3

export function is_install(){
    return ! (window.ethereum == null)
}

export function get_provider(){
    return new web3(window.ethereum)
}

export async function  connect (){
    let provider = get_provider()
    let accounts = await provider.eth.requestAccounts()
    return accounts[0];
}

