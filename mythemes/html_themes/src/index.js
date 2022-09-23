// import _ from 'lodash'
import $ from 'jquery'

import './scss/styles.scss'
import {connect, is_install} from './util/wallet'
// Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'
$(document).ready(()=>{
  $("#wallet_connect").click(async function(){
      try{
        if(!is_install()){
          $("#wallet_connect").text('install');
          return
        }
        $("#wallet_connect").text(await connect())
      }catch(e){
        console.log(e)
      }
  });
})