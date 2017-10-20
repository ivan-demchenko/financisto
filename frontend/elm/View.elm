module View exposing (..)

import Html exposing (Html, span, div, text, header, footer)
import Html.Attributes exposing (class)
import Messages exposing (Msg(..))
import Models exposing (Model)
import Routing exposing (Route(..))
import Login.Main as LoginModule
import Home.Main as HomeModule
import Upload.Main as UploadModule
import Navigation.Main as NavModule


view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ header [ class "header" ]
            [ span [ class "logo" ] [ text "Financisto" ]
            , Html.map NavigationMsg NavModule.view
            ]
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


notFoundView : Html Msg
notFoundView =
    div [ class "not-found" ]
        [ text "Not found"
        ]
