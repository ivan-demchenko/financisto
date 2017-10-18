module Home.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Navigation


type Msg
    = Noop
    | GoToLogin


type alias Model =
    { text : String }


init : Model
init =
    Model "This is home"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg mdl =
    case msg of
        Noop ->
            ( mdl, Cmd.none )

        GoToLogin ->
            ( mdl, Navigation.newUrl "#login" )


view : Model -> Html Msg
view model =
    div []
        [ text model.text
        , ul []
            [ li [] [ a [ href "/#login" ] [ text "Login" ] ]
            , li [] [ a [ href "/#upload" ] [ text "Upload" ] ]
            ]
        ]
