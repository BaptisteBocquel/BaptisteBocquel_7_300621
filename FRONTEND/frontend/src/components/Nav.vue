<template>
  
    <div id="nav">
        <img alt="Groupomania logo" src="../assets/icon-left-font-monochrome-white.png" class="login-img" >
        <p id="pseudo_nav">Bonjour {{ user_pseudo }}</p>
        <router-link to="/">Déconnexion</router-link> 
    </div>
    
</template>

<style lang="scss">
    #nav{
        display:flex;
        align-items: center;
        justify-content: space-between;
        height: 80px;
        padding-right: 50px;
        padding-left:20px;
        padding-top: 10px;
        background-color: #fd2d01;
        & img{
            width:200px ;
            height: 60px;
            object-fit:cover;
            

        }
        & p{
            margin-left : -70px;
        }
        & a{
            color: white;
            font-size:17px;
        }
        #pseudo_nav{
            color: white;
            font-size: 20px;
        }
    }
</style>

<script>

export default {
  name: 'Nav',
  data(){
      return{
          user_pseudo : localStorage.getItem('pseudo')
      }
  },
  components: {
    
  }, 
}
</script>

