<template>
  <div class="monCompte">
    <Nav/>
    <div class="compte">
      <h1>Mon compte</h1>
      
        <div class="displayAccount">
          <h2> PSEUDO : </h2> <br/> <p> {{ account.user_pseudo }}  </p>
          <h2> MAIL : </h2> <br/> <p> {{ account.user_mail }}  </p>
          <h2> PASSWORD : </h2> <p> <br/> {{ account.user_password}}</p>
          <h2> BIO : </h2> <br/> <p> {{ account.user_bio }}  </p>    
        </div>

        <div class="compte-choice">
          <p id="toAccount"><router-link to="/ModifyMyAccount" id="toAccount">Modifier mon compte</router-link></p>
          <p><span id="toDelete"   @click="deleteAccount">Supprimer mon compte</span></p>

        </div>

        <div id="warning_account"></div>
    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from '../components/Nav.vue';
import axios from 'axios';

export default {
  name: 'myAccount',
  components: {
    Nav
  },
  data () {
    return{
      account: "", 
      modify: true,
    }
  },
  mounted () {
    let token = localStorage.getItem("token");

    if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
    }

    axios
      .get('http://localhost:3000/api/auth/me',
      {
          headers : {
            Authorization: `Bearer ${token}`,
          }
      })
      .then(response => (this.account = response.data))
      
  },
  methods: {
    deleteAccount : function(){
      if (confirm('Êtes vous sûr de vouloir supprimer votre compte ? '))
      {
        let token = localStorage.getItem("token");

        if(!token){
         localStorage.clear();
         document.location.href="http://localhost:8080";
        }

        axios
        .delete('http://localhost:3000/api/auth/me',
        {
            headers : {
              Authorization: `Bearer ${token}`,
            }
        })
        .then(() => {
          localStorage.clear()
          document.location.href="http://localhost:8080/";
        })
        .catch(e => { 
          if(e.response.data.error === "user not found"){
            alert("Un problème d'authentification à eu lieu, merci de vous reconnecter.");
            localStorage.clear();
            document.location.href="http://localhost:8080/";
          }else{
            let warning = document.getElementById('warning_account');
            warning.textContent = "Un problème est survenu";
          }
        })
      }
    }   
  }
  
}
</script>

<style scoped lang="scss">
  .compte{
    margin:0 auto;
    width: 100%;
    text-align:center;
    h1{
      margin-top: -1px;
      margin-bottom: 60px;
      background-color: #b64e39;
      color: white; 
      height:80px;
      width: 100%;
      padding-bottom: 20px;
    }
    h2{
      text-align: center;
      color: #b64e39;
    }
    p{
      font-size: 21px;
      margin-bottom: 55px;
    }
    #toAccount{
      color: black;
    }
    &-choice{
      display:flex;
      justify-content: center;
      p{
        margin-right: 40px;
        
      }
      #toAccount{
      color: black;
      }
      #toDelete{
        color: #b64e39;
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }

  // TABLETTES DISPLAY

@media screen and (min-width: 600px) and (max-width:1024px) {
  .compte{
    width: 100%;
    margin: 0;
  }
}

//MOBILE DISPLAY
@media screen and (min-width: 350px) and (max-width: 599px){
  .compte{
    width: 100%;
    margin: 0;
    
    p{
      word-wrap: break-word;
      padding-right: 20px;
      padding-left: 20px;
    }
    
  }
}
</style>  