module Upload.Main exposing (..)

import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick, onInput)
import Http
import Json.Decode as JD
import Json.Encode as JE
import Navigation


type alias Model =
    { text : String
    , uploadError : Maybe String
    }


type Msg
    = Noop
    | EnterCSV String
    | TriggerDataSent
    | DataPostage (Result Http.Error String)
    | GoToHome


postCSVData : String -> Cmd Msg
postCSVData csvString =
    let
        url =
            "http://localhost:3000/api/uploads"

        reqBody =
            Http.jsonBody <|
                JE.object
                    [ ( "csv", JE.string csvString ) ]
    in
        Http.send DataPostage <| Http.post url reqBody (JD.field "id" JD.string)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Noop ->
            ( model, Cmd.none )

        DataPostage (Ok data) ->
            ( { model | text = data }, Cmd.none )

        DataPostage (Err _) ->
            ( { model | uploadError = Just "Error" }, Cmd.none )

        TriggerDataSent ->
            ( model, (postCSVData model.text) )

        EnterCSV txt ->
            ( { model | text = txt }, Cmd.none )

        GoToHome ->
            ( model, Navigation.newUrl "#" )


renderUploadError : Maybe String -> Html Msg
renderUploadError str =
    case str of
        Just msg ->
            div [] [ text msg ]

        Nothing ->
            div [] []


view : Model -> Html Msg
view model =
    div [ class "csv-input" ]
        [ h3 [] [ text "Please, paste the CSV data here:" ]
        , textarea
            [ class "csv-input__source"
            , onInput EnterCSV
            ]
            []
        , (renderUploadError model.uploadError)
        , div
            [ class "csv-input__action-bar" ]
            [ button
                [ class "csv-input__action"
                , onClick TriggerDataSent
                ]
                [ text "Upload the data" ]
            , button
                [ class "csv-input__action"
                , onClick GoToHome
                ]
                [ text "Go home" ]
            ]
        ]


init : Model
init =
    Model "" Nothing
