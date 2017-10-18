module Login.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)
import Navigation


type Msg
    = Noop
    | GoToHome


type alias Model =
    { text : String }


init : Model
init =
    Model "This is login"


update : Msg -> Model -> ( Model, Cmd Msg )
update msg mdl =
    case msg of
        Noop ->
            ( mdl, Cmd.none )

        GoToHome ->
            ( mdl, Navigation.newUrl "#" )


view : Model -> Html Msg
view model =
    div []
        [ text model.text
        , a [ href "/" ] [ text "Home" ]
        ]
