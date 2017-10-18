module Messages exposing (..)

import Navigation exposing (Location)
import Login.Main as LoginModule
import Home.Main as HomeModule
import Upload.Main as UploadModule


type Msg
    = OnLocationChange Location
    | HomeMsg HomeModule.Msg
    | LoginMsg LoginModule.Msg
    | UploadMsg UploadModule.Msg
