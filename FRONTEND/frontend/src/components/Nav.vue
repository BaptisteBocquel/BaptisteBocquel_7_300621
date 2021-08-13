<template>
  
    <div id="nav">
        
        <nav class="navbar navbar-expand-md navbar-light ">
            <router-link class="navbar-brand" to="/home"><img alt="Groupomania logo" src="../assets/icon-left-font-monochrome-white.png" class="login-img" ></router-link>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item nav-item-little">
                        <router-link to="/MyAccount">Mon compte</router-link> 
                    </li>
                    <li class="nav-item nav-item-little">
                        <a href="#">Conditions générales</a> 
                    </li>
                    <li class="nav-item nav-item-little">
                        <a href="#">Politique de confidentialité</a> 
                    </li>
                    <li class="nav-item nav-item-little">
                        <a href="#">Conseils de modération</a> 
                    </li>
                    <li class="nav-item">
                        <router-link @click.native="disconnect" to="/">Déconnexion</router-link> 
                    </li>
                    
                </ul>
            </div>
        </nav>
    </div>

    
    
</template>

<style lang="scss">
    #nav{
        .navbar{
            background-color: #fd2d01;
            margin: 0;
            .nav-item-little{
                display:none;
            }
        }
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

    @media screen and (min-width: 600px) and (max-width:1024px) {
        #nav{
            p{
                margin-bottom: 0;
                margin-left: 10px;
            }
            & img{
                width:180px ;
                height: 60px;
                object-fit:cover;
            }   
        }
    }

    @media screen and (max-width: 599px) {
        #nav{
            .navbar{
                .nav-item{
                    margin-bottom: 10px;
                }
                .nav-item-little{
                    display:flex;
                }
            }
            & img{
                width: 180px;
                height:60px;
            }
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
  methods: {
      disconnect: function (){
          localStorage.clear();
      }
  }
  
}
</script>

