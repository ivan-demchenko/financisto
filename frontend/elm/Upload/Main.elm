module Upload.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)
import Navigation


type alias Model =
    { text : String
    }


type Msg
    = Noop
    | GoToHome


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        GoToHome ->
            ( model, Navigation.newUrl "#" )


view : Model -> Html Msg
view model =
    div [ class "csv-input" ]
        [ h3 [] [ text "Please, paste the CSV data here:" ]
        , textarea [ class "csv-input__source" ] []
        , div
            [ class "csv-input__action-bar" ]
            [ button
                [ class "csv-input__action" ]
                [ text "Upload the data" ]
            , button
                [ class "csv-input__action", onClick GoToHome ]
                [ text "Go home" ]
            ]
        ]


init : Model
init =
    Model ""