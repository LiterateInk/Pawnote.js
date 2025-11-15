import { describe, expect, it } from "bun:test";
import { deserialize } from "desero";
import { FonctionParametresModel } from "~/api/FonctionParametres/response";
import { Cours, PageEmploiDuTempsModel } from "~/api/PageEmploiDuTemps/response";
import { Timetable } from "~/index";
import { Parameters } from "~/models/Parameters";

const data = {
  "avecCoursAnnule": true,

  "ListeCours": [
    {
      "N": "31#i144awgA9j4flun1HngKjs9NvofKVzI4khNYoQ4RxqM",
      G: 0,
      "P": 901,
      "place": 22,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "10/09/2024 10:00:00"
      },
      "CouleurFond": "#E73A1F",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ANGLAIS",
            "N": "83#Liy41wAVytsTZJfrDh15BEvrBy_PvcT3d0cVIo_fnFY",
            G: 16
          },
          {
            G: 3,
            L: "BRYISH A."
          },
          {
            L: "[2AGL10]",
            "N": "64#5Fp4hMGKFK-nWxofAjAPoY5yxKMjhOdUKRVMo0wQd_k",
            G: 2
          },
          {
            L: "A 103 - W",
            "N": "139#HSpAblWp7aN-qsyGkCpe3k8F3NfueG7tIwhJ3EfJ0eM",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#iDvOY9z0hDerfSYl9N5z06-HNjnOB9uOmyAN50eih2o",
      G: 0,
      "P": 390,
      "place": 34,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "10/09/2024 16:00:00"
      },
      "CouleurFond": "#11B1D2",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ACCOMPAGNEMT. PP",
            "N": "83#aeW2PEEyEQeFy4Ygxv6NI1xOxWa1jNvJRIK5JRVNUrI",
            G: 16
          },
          {
            G: 3,
            L: "VIVEZ M."
          },
          {
            L: "M 05",
            "N": "139#6haBmbgjZ8505YIa-B3NIOpbyz4S_K0YYUdg2JHeZd8",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#n2CtUFixZ3zFURvO2zL2RERSxp8il3POfZF870bcPfk",
      G: 0,
      "P": 327,
      "place": 30,
      "duree": 4,
      "DateDuCours": {
        "_T": 7,
        "V": "10/09/2024 14:00:00"
      },
      "CouleurFond": "#ED679B",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "HISTOIRE-GEOGRAPHIE",
            "N": "83#KRTlaeFcNpVyc8U8HK4HjvWQ141cbih4B67Uw4iY7xQ",
            G: 16
          },
          {
            G: 3,
            L: "HISM A."
          },
          {
            L: "B 114 - W",
            "N": "139#CAJRc3ZfhZuL9_DzKf1T8mjVVxs428AyCnw-0wY9SOg",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#EyFlAo1nbM90TvI0kxiuvk820vMzjBJo7EagLgUwHM4",
      G: 0,
      "P": 326,
      "place": 42,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "11/09/2024 10:00:00"
      },
      "CouleurFond": "#ED679B",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "HISTOIRE-GEOGRAPHIE",
            "N": "83#KRTlaeFcNpVyc8U8HK4HjvWQ141cbih4B67Uw4iY7xQ",
            G: 16
          },
          {
            G: 3,
            L: "HISM A."
          },
          {
            L: "B 114 - W",
            "N": "139#CAJRc3ZfhZuL9_DzKf1T8mjVVxs428AyCnw-0wY9SOg",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#OvN-hndA-yOwpPEFXCkv0ApjdUV0vUcKjf0rmUPrmDU",
      G: 0,
      "P": 646,
      "place": 90,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 14:00:00"
      },
      "CouleurFond": "#6EBC81",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ITALIEN",
            "N": "83#mQHfqfuWecV3ZL796CHXs3cofVvscqfmXM7JgR7dgmM",
            G: 16
          },
          {
            G: 3,
            L: "MARIO L."
          },
          {
            L: "[2ITA2]",
            "N": "64#Ly2Hj2g9PIKc6gBLFrWpVpZlxfz9LVBELnKmRkWe2cY",
            G: 2
          },
          {
            L: "A 116",
            "N": "139#w6ooeKypQqSe7p_hCFLl-lWiYm144w68FntwzZconKA",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#tDuXQrhZHPPJSFNShQuPHwRWSjUF-Cny9FKp8kO96Ic",
      G: 0,
      "P": 906,
      "place": 92,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 15:00:00"
      },
      "CouleurFond": "#E73A1F",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ANGLAIS",
            "N": "83#Liy41wAVytsTZJfrDh15BEvrBy_PvcT3d0cVIo_fnFY",
            G: 16
          },
          {
            G: 3,
            L: "BRYISH A."
          },
          {
            L: "[2AGL10]",
            "N": "64#5Fp4hMGKFK-nWxofAjAPoY5yxKMjhOdUKRVMo0wQd_k",
            G: 2
          },
          {
            L: "A 103 - W",
            "N": "139#HSpAblWp7aN-qsyGkCpe3k8F3NfueG7tIwhJ3EfJ0eM",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#mVG40ZKww0PdaugNzBxEBT-4V9UQ7Lo8IfFu_4wQD98",
      G: 0,
      "P": 1290,
      "place": 12,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "09/09/2024 15:00:00"
      },
      "CouleurFond": "#C0C0C0",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "CREAT.INNOV.TECHNO.",
            "N": "83#IkSIq537V7wHAGrQvM3xk8DyJvKuOW1AT8STh-EwRyU",
            G: 16
          },
          {
            G: 3,
            L: "PAUL M."
          },
          {
            L: "[2CITEC2]",
            "N": "64#uVtu4jlHo8DkCWIaYwiVDFAAKqzi2XPSWhInJOYFXdg",
            G: 2
          },
          {
            L: "B 219 - W",
            "N": "139#BLXhIlGowNNXOCRD78sPLGC1XScXiGwiHAZTKP6vpMc",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#Pc155MtBl1NeXrQFOsA50GtQDkV0AxvmjqGOPiMp2Vk",
      G: 0,
      "P": 398,
      "place": 80,
      "duree": 4,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 09:00:00"
      },
      "CouleurFond": "#E73A1F",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ED.PHYSIQUE & SPORT.",
            "N": "83#NfYblNlIX5718W99ctmzV97kpOwy2-x87UAfIy6fHXk",
            G: 16
          },
          {
            G: 3,
            L: "PEDROSO S."
          },
          {
            L: "EPS 2GT",
            "N": "139#MheIZAjWfWECSazfuRvJ1r2RiQybkXbGbUDOZOJhsR4",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#PbBZtEPDGN6kvsPKwurmSjMlgM_7HI3yBvqYzDDc_yc",
      G: 0,
      "P": 911,
      "place": 40,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "11/09/2024 09:00:00"
      },
      "CouleurFond": "#E73A1F",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ANGLAIS",
            "N": "83#Liy41wAVytsTZJfrDh15BEvrBy_PvcT3d0cVIo_fnFY",
            G: 16
          },
          {
            G: 3,
            L: "BRYISH A."
          },
          {
            L: "[2AGL10]",
            "N": "64#5Fp4hMGKFK-nWxofAjAPoY5yxKMjhOdUKRVMo0wQd_k",
            G: 2
          },
          {
            L: "A 211 - W",
            "N": "139#tN1tht8-PxgLXqixd3f9JtgXyCh1arl17rT35oRfnX0",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#RvbbqNo1D594VjuJZxbdg5X-HDURsLbHqEsUYCQyiYA",
      G: 0,
      "P": 663,
      "place": 72,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 15:00:00"
      },
      "CouleurFond": "#6EBC81",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ITALIEN",
            "N": "83#mQHfqfuWecV3ZL796CHXs3cofVvscqfmXM7JgR7dgmM",
            G: 16
          },
          {
            G: 3,
            L: "MARIO L."
          },
          {
            L: "[2ITA2]",
            "N": "64#Ly2Hj2g9PIKc6gBLFrWpVpZlxfz9LVBELnKmRkWe2cY",
            G: 2
          },
          {
            L: "A 116",
            "N": "139#w6ooeKypQqSe7p_hCFLl-lWiYm144w68FntwzZconKA",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#nWv1p6fsUNpKEo9Fpx2yKmxPTlSeSteJ1Ouiq67IFxc",
      G: 0,
      "P": 344,
      "place": 94,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 16:00:00"
      },
      "CouleurFond": "#4EC2EE",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "MATHEMATIQUES",
            "N": "83#q1jtRcfrKmDAMv4Fzjo03BMKaaXvHZuuafbsmEmCyYk",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "B 113",
            "N": "139#NM01iqS3k6xq66NJLkqQpAaqRppgt5awjxTzhcjGRBs",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#Zivw9cJk4Q-vOkkHhNCPxq4mLf7-o4g5EU6Co9CL8Xs",
      G: 0,
      "P": 664,
      "place": 36,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "10/09/2024 17:00:00"
      },
      "CouleurFond": "#6EBC81",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "ITALIEN",
            "N": "83#mQHfqfuWecV3ZL796CHXs3cofVvscqfmXM7JgR7dgmM",
            G: 16
          },
          {
            G: 3,
            L: "MARIO L."
          },
          {
            L: "[2ITA2]",
            "N": "64#Ly2Hj2g9PIKc6gBLFrWpVpZlxfz9LVBELnKmRkWe2cY",
            G: 2
          },
          {
            L: "A 116",
            "N": "139#w6ooeKypQqSe7p_hCFLl-lWiYm144w68FntwzZconKA",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#yrD6ghTQin_p0fYHD9ubcR_BXugZg77gyAZ9dKRf3lc",
      G: 0,
      "P": 865,
      "place": 60,
      "duree": 3,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 09:00:00"
      },
      "CouleurFond": "#43B061",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "SCIENCES VIE & TERRE",
            "N": "83#z2MCpw1GDdnQggueeGSW2XHbjFNOf4iI_x-LRBOJ3W4",
            G: 16
          },
          {
            G: 3,
            L: "VIVEZ M."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "LABOS SVT",
            "N": "139#65qizOANfWofY0yg9WfKW6e4feYy8QIZcEjSimZ8euA",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#ndJcepETu7RprJTjWF9xFRNelF-2xUockgxA5YPAcCE",
      G: 0,
      "P": 868,
      "Statut": "Cours annulé",
      "estAnnule": true,
      "place": 63,
      "duree": 3,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 10:30:00"
      },
      "CouleurFond": "#0099DA",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "PHYSIQUE-CHIMIE",
            "N": "83#Vmy8PpiSedDVWwwYt6j45a56-8PuOwOTzFzAM8Cyu-s",
            G: 16
          },
          {
            G: 3,
            L: "FYCHI S."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "LABOS PHCH",
            "N": "139#RfM92ZkaV_xVsUxD-igLK9lM1Sz_zlHbiG7n_AOr72I",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#_pbsVEBNDjg-UkS3aN7vm5iClTQhkPeJTHDP1faFjgY",
      G: 0,
      "P": 1191,
      "place": 76,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 17:00:00"
      },
      "CouleurFond": "#4EC2EE",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "MATHEMATIQUES",
            "N": "83#q1jtRcfrKmDAMv4Fzjo03BMKaaXvHZuuafbsmEmCyYk",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "B 116 - W",
            "N": "139#0IqbY5cx2Gcy0w592ttbjflHkTopOK1-qZIR2jLsjTE",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#Z3z7ZihVoRn90DAHZa5QBwjIRApmUkV4Dp2ZwPz_Doc",
      G: 0,
      "P": 1063,
      "place": 10,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "09/09/2024 14:00:00"
      },
      "CouleurFond": "#ED6566",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "SC.NUMERIQ.TECHNOL.",
            "N": "83#QbplG9A8rzYq-kXdDGUybalOxbFztxPIKQkUuWn5a9U",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "A 106 - MEDIALANGUES",
            "N": "139#1HuubNgB5LUhZ3uPyQ3jrmUmodZTD4paek0Nd4XCGAA",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#gNhfFUxjdjetvzk_gXuFBMc1p12RtTNBlXHj1EnsvJs",
      G: 0,
      "P": 553,
      "place": 4,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "09/09/2024 11:00:00"
      },
      "CouleurFond": "#4EC2EE",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "MATHEMATIQUES",
            "N": "83#q1jtRcfrKmDAMv4Fzjo03BMKaaXvHZuuafbsmEmCyYk",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "B 111",
            "N": "139#OscJsqMf-qHnEUgaGIJyEpS34alFGIdp6Uw_0QGDftk",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#x0CCcUSVGHxTKavgQLkbBg-zyxxSyKkywslNOohiQPE",
      G: 0,
      "P": 554,
      "place": 66,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 12:00:00"
      },
      "CouleurFond": "#4EC2EE",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "MATHEMATIQUES",
            "N": "83#q1jtRcfrKmDAMv4Fzjo03BMKaaXvHZuuafbsmEmCyYk",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "A 216",
            "N": "139#0QbWA2LGiJ4hW52TuAiEgHlo_nHowJtzZgHJGl_QPnQ",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#YilybyFEZZH0O3M6XBTIwB4yoNgKAA6ypXohtgvwrM8",
      G: 0,
      "P": 1064,
      "place": 70,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 14:00:00"
      },
      "CouleurFond": "#ED6566",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "SC.NUMERIQ.TECHNOL.",
            "N": "83#QbplG9A8rzYq-kXdDGUybalOxbFztxPIKQkUuWn5a9U",
            G: 16
          },
          {
            G: 3,
            L: "JEU M."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "A137",
            "N": "139#ieN0SO2a4F6zpuvyM4aC8H4-P9tzDDN4XLSokaHDqyE",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#-Jq5HwqKIbWzp9IWb7PAnaPuQQ7_hZVetd4W47WMNw0",
      G: 0,
      "P": 306,
      "place": 88,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 13:00:00"
      },
      "CouleurFond": "#9495CA",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "FRANCAIS",
            "N": "83#4HhwkxrjBXkNX_pYd0O4f9obxtMspU_6HntiRw6mW-w",
            G: 16
          },
          {
            G: 3,
            L: "FRAUN C."
          },
          {
            L: "B 111",
            "N": "139#OscJsqMf-qHnEUgaGIJyEpS34alFGIdp6Uw_0QGDftk",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#FgyvPodlirvu_FCo_Ot_DRYEAi6qQFCxLy4eXH-hKJA",
      G: 0,
      "P": 307,
      "place": 74,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 16:00:00"
      },
      "CouleurFond": "#9495CA",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "FRANCAIS",
            "N": "83#4HhwkxrjBXkNX_pYd0O4f9obxtMspU_6HntiRw6mW-w",
            G: 16
          },
          {
            G: 3,
            L: "FRAUN C."
          },
          {
            L: "B 111",
            "N": "139#OscJsqMf-qHnEUgaGIJyEpS34alFGIdp6Uw_0QGDftk",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#i6nJPJCTb8u--zD8xSFiBzWaRCdPXoMV6DZc3y8V_ss",
      G: 0,
      "P": 308,
      "place": 44,
      "duree": 4,
      "DateDuCours": {
        "_T": 7,
        "V": "11/09/2024 11:00:00"
      },
      "CouleurFond": "#9495CA",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "FRANCAIS",
            "N": "83#4HhwkxrjBXkNX_pYd0O4f9obxtMspU_6HntiRw6mW-w",
            G: 16
          },
          {
            G: 3,
            L: "FRAUN C."
          },
          {
            L: "B 111",
            "N": "139#OscJsqMf-qHnEUgaGIJyEpS34alFGIdp6Uw_0QGDftk",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#gqQRSGM4p2yJSNj4u-Brx9OpVParYdP6RH0b4PSYu9U",
      G: 0,
      "P": 371,
      "place": 2,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "09/09/2024 10:00:00"
      },
      "CouleurFond": "#7CB927",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "SC. ECONO.& SOCIALES",
            "N": "83#AhjlLCLYmFw-_36peq_YdNZ9Nji6xtb950Qa3gLa7OU",
            G: 16
          },
          {
            G: 3,
            L: "MONEY M."
          },
          {
            L: "M 04",
            "N": "139#qvzI_g6k68OpS5tSImQbePpne5VhQQh330Qwc6klKjs",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#4dBYe7oOCf0UHlJomY7LD6AB_-8FqY7bw3KYzedwpGs",
      G: 0,
      "P": 1141,
      "place": 26,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "10/09/2024 12:00:00"
      },
      "CouleurFond": "#C0C0C0",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "CREAT.INNOV.TECHNO.",
            "N": "83#IkSIq537V7wHAGrQvM3xk8DyJvKuOW1AT8STh-EwRyU",
            G: 16
          },
          {
            G: 3,
            L: "PAUL M."
          },
          {
            L: "[2CITEC2]",
            "N": "64#uVtu4jlHo8DkCWIaYwiVDFAAKqzi2XPSWhInJOYFXdg",
            G: 2
          },
          {
            L: "B 219 - W",
            "N": "139#BLXhIlGowNNXOCRD78sPLGC1XScXiGwiHAZTKP6vpMc",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#AaW0ZzuGWoNWo_eP2bAsOeJZq1DCbCrsOeiv5C21l-g",
      G: 2,
      "P": 1275,
      "Statut": "Changement de salle",
      "place": 63,
      "duree": 3,
      "DateDuCours": {
        "_T": 7,
        "V": "12/09/2024 10:30:00"
      },
      "CouleurFond": "#C0C0C0",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "TESTS DE POSITIONNEMENT",
            "N": "83#5jbqGRodveQvNDio1kWrOZsB3Xw5f2hKKlEKaVA7Y9k",
            G: 16
          },
          {
            G: 3,
            L: "FYCHI S."
          },
          {
            L: "[2H-G.1]",
            "N": "64#VmHx1tPCwq84LUi_qIujcz264B2s4LowugT34qPh4no",
            G: 2
          },
          {
            L: "LABOS PHCH",
            "N": "139#RfM92ZkaV_xVsUxD-igLK9lM1Sz_zlHbiG7n_AOr72I",
            G: 17
          },
          {
            L: "A137",
            "N": "139#ieN0SO2a4F6zpuvyM4aC8H4-P9tzDDN4XLSokaHDqyE",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    },
    {
      "N": "31#WGCO_hjHbYW_xOVcf69Su_UY7idWUd_d2Kem1CzzCQ8",
      G: 0,
      "P": 381,
      "place": 84,
      "duree": 2,
      "DateDuCours": {
        "_T": 7,
        "V": "13/09/2024 11:00:00"
      },
      "CouleurFond": "#0099DA",
      "ListeContenus": {
        "_T": 24,
        "V": [
          {
            L: "PHYSIQUE-CHIMIE",
            "N": "83#Vmy8PpiSedDVWwwYt6j45a56-8PuOwOTzFzAM8Cyu-s",
            G: 16
          },
          {
            G: 3,
            L: "FYCHI S."
          },
          {
            L: "B 102 - SVT - W",
            "N": "139#BxiJkq4yc7AEm_T-xV2wHIA2i-XvuLjuI0qp47-fr10",
            G: 17
          }
        ]
      },
      "AvecTafPublie": false
    }
  ].map((cours) => deserialize(Cours, cours)).filter((cours) => cours.dateDuCours.getDate() === 9)
} as unknown as PageEmploiDuTempsModel;

const parameters = {
  general: {
    placesParJour: 20,
    premierLundi: new Date("2024-09-02"),
    listeHeures: [
      {
        G: 0,
        L: "09h30",
        a: false
      },
      {
        G: 1,
        L: "09h55",
        a: false
      },
      {
        G: 2,
        L: "10h30",
        a: false
      },
      {
        G: 3,
        L: "10h55"
      },
      {
        G: 4,
        L: "11h30",
        a: false
      },
      {
        G: 5,
        L: "11h55",
        a: false
      },
      {
        G: 6,
        L: "12h30",
        a: false
      },
      {
        G: 7,
        L: "12h55",
        a: false
      },
      {
        G: 8,
        L: "13h30",
        a: false
      },
      {
        G: 9,
        L: "13h55",
        a: false
      },
      {
        G: 10,
        L: "14h30",
        a: false
      },
      {
        G: 11,
        L: "14h55",
        a: false
      },
      {
        G: 12,
        L: "15h30",
        a: false
      },
      {
        G: 13,
        L: "15h55"
      },
      {
        G: 14,
        L: "16h30",
        a: false
      },
      {
        G: 15,
        L: "16h55",
        a: false
      },
      {
        G: 16,
        L: "17h30",
        a: false
      },
      {
        G: 17,
        L: "17h55",
        a: false
      },
      {
        G: 18,
        L: "18h30",
        a: false
      },
      {
        G: 19,
        L: "18h55"
      },
      {
        G: 20,
        L: "18h55",
        a: false
      }
    ]
  }
} as unknown as FonctionParametresModel;

describe("Timetable", () => {
  it("should filter lessons properly", () => {
    const timetable = new Timetable(new Parameters({ data: parameters }), { data });
    const entries = timetable.filter(false, true, true);
    expect(entries).toBeArrayOfSize(4);
  });
});
