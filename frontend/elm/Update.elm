module Update exposing (..)

import Routing exposing (parseLocation)
import Models exposing (Model)
import Messages exposing (..)
import Home.Main as Home
import Login.Main as Login


update : Msg -> Model -> ( Model, Cmd msg )
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
                ( { model | home = newHomeModel }, Cmd.none )

        LoginMsg loginMsg ->
            let
                ( newLoginModel, homeFx ) =
                    Login.update loginMsg model.home
            in
                ( { model | home = newLoginModel }, Cmd.none )
