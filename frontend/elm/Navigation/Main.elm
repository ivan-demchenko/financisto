module Navigation.Main exposing (..)

import Html exposing (Html, nav, button, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Navigation exposing (newUrl)


type Msg
    = NavHome
    | NavLogin
    | NavUpload


goto : Msg -> Cmd msg
goto msg =
    case msg of
        NavHome ->
            newUrl "#"

        NavLogin ->
            newUrl "#login"

        NavUpload ->
            newUrl "#upload"


view : Html Msg
view =
    nav [ class "header-nav" ]
        [ button
            [ class "header-nav__item"
            , onClick NavHome
            ]
            [ text "Home" ]
        , button
            [ class "header-nav__item"
            , onClick NavUpload
            ]
            [ text "Upload" ]
        , button
            [ class "header-nav__item"
            , onClick NavLogin
            ]
            [ text "Login" ]
        ]
