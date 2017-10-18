module View exposing (..)

import Html exposing (Html, div, text, header, footer)
import Html.Attributes exposing (class)
import Messages exposing (Msg(..))
import Models exposing (Model)
import Routing exposing (Route(..))
import Login.Main as LoginModule
import Home.Main as HomeModule
import Upload.Main as UploadModule


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ header [ class "header" ] [ text "Financisto" ]
        , div [ class "main-content" ]
            [ page model
            ]
        , footer [ class "footer" ] [ text "Copyright &copy; Ivan Demchenko" ]
        ]


page : Model -> Html Msg
page model =
    case model.route of
        LoginRoute ->
            Html.map LoginMsg (LoginModule.view model.login)

        HomeRoute ->
            Html.map HomeMsg (HomeModule.view model.home)

        UploadRoute ->
            Html.map UploadMsg (UploadModule.view model.upload)

        NotFoundRoute ->
            notFoundView


notFoundView : Html msg
notFoundView =
    div [ class "not-found" ]
        [ text "Not found"
        ]
