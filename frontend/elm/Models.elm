module Models exposing (..)

import Routing
import Login.Main as LoginModule
import Home.Main as HomeModule
import Upload.Main as UploadModule


type alias Model =
    { route : Routing.Route
    , login : LoginModule.Model
    , home : HomeModule.Model
    , upload : UploadModule.Model
    }


initialModel : Routing.Route -> Model
initialModel route =
    { route = route
    , login = LoginModule.init
    , home = HomeModule.init
    , upload = UploadModule.init
    }
