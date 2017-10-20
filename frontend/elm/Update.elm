module Update exposing (..)

import Routing exposing (parseLocation)
import Models exposing (Model)
import Messages exposing (..)
import Home.Main as Home
import Login.Main as Login
import Upload.Main as Upload
import Navigation.Main as NavModule


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnLocationChange location ->
            let
                newRoute =
                    parseLocation location
            in
                ( { model | route = newRoute }, Cmd.none )

        HomeMsg homeMsg ->
            let
                ( newHomeModel, homeFx ) =
                    Home.update homeMsg model.home
            in
                ( { model | home = newHomeModel }, Cmd.map HomeMsg homeFx )

        LoginMsg loginMsg ->
            let
                ( newLoginModel, loginFx ) =
                    Login.update loginMsg model.home
            in
                ( { model | login = newLoginModel }, Cmd.map LoginMsg loginFx )

        UploadMsg uploadMsg ->
            let
                ( newUploadModel, uploadFx ) =
                    Upload.update uploadMsg model.upload
            in
                ( { model | upload = newUploadModel }, Cmd.map UploadMsg uploadFx )

        NavigationMsg navMsg ->
            ( model, NavModule.goto navMsg )
