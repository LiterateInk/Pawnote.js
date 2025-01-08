import { RequestFN } from "~/core/request-function";
import { encodeDomain } from "~/encoders/domain";
import { NewsInformation, type NewsItem, NewsSurvey, type SessionHandle, TabLocation } from "~/models";
import { NewsQuestionKind } from "~/models/news-question-kind";
import { apiProperties } from "./api-properties";

/**
 * Updates the status of a news item.
 * Could be a read, or answer to a survey.
 */
export const newsRemoteMutate = async (session: SessionHandle, item: NewsInformation | NewsSurvey, options = {
  delete: false,
  markAsRead: true,
  onlyMarkAsRead: false
}) => {
  const properties = apiProperties(session);

  const answers = (options.onlyMarkAsRead || options.delete) ? []
    : item.is === "information" ? [item.question] : item.questions;

  const request = new RequestFN(session, "SaisieActualites", {
    [properties.signature]: { onglet: TabLocation.News },

    [properties.data]: {
      listeActualites: [{
        N: item.id,
        L: item.title ?? "",

        genrePublic: item.public.G,
        public: item.public,

        validationDirecte: true,

        listeQuestions: answers.map((answer) => ({
          N: answer.id,
          L: answer.fullTitle,
          genreReponse: answer.kind,

          reponse: {
            N: parseInt(answer.answerID),
            Actif: true,

            // Should give a string directly when we reply to an information
            // or when the question is just a text input.
            valeurReponse: (answer.kind === NewsQuestionKind.InformationText || answer.kind === NewsQuestionKind.TextInput)
              ? answer.textInputAnswer ?? ""
              : { // Otherwise, pass the choices as an array of numbers.
                _T: 8,
                V: encodeDomain(answer.selectedAnswers ?? [])
              },

            // Defined when the question have choices which can have a text input : "Other" choice.
            valeurReponseLibre: (answer.choices.filter((choice) => choice.isTextInput).length > 0)
              ? answer.textInputAnswer
              : undefined,

            avecReponse: answer.answered,
            estReponseAttendue: answer.shouldAnswer,
            _validationSaisie: true
          }
        })),

        marqueLueSeulement: !options.delete && options.onlyMarkAsRead,
        lue: !options.delete && options.markAsRead,
        supprimee: !options.onlyMarkAsRead && options.delete,
        saisieActualite: false
      }],

      saisieActualite: false
    }
  });

  await request.send();
};
