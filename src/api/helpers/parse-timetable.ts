import type { SessionHandle, Timetable, TimetableClass } from "~/models";
type temp = Array<(Timetable["classes"][number] & { _visible?: boolean })>;

/**
 * Mutates the original timetable object to parse it.
 * This method is using the official PRONOTE way to parse the timetable.
 *
 * ## Why this isn't the responsibility of the internal `decodeTimetable()` ?
 *
 * Simply because it may be too overkill and not everyone would want this.
 * We must provide the data as is and let the user decide what to do with it.
 *
 * That's why we provide this helper function to parse the timetable.
 * @param {SessionHandle} session - The current session handle.
 * @param {Timetable} timetable - The timetable to parse.
 * @param {Object} options - The options to parse the timetable.
 * @returns {void} - Nothing.
 */
export const parseTimetable = (session: SessionHandle, timetable: Timetable, {
  withSuperposedCanceledClasses = false,
  withCanceledClasses = timetable.withCanceledClasses,
  withPlannedClasses = true
}): void => {
  const classes = timetable.classes as temp;

  if (!withCanceledClasses) {
    for (const current of classes) {
      if (current.is === "lesson" && current.canceled) {
        current._visible = false;
      }
    }
  }

  if (!withPlannedClasses) {
    for (const current of classes) {
      if (
        current.is === "lesson" &&
        current._visible !== false &&
        !current.canceled &&
        [ // TODO: cerate TimetableClassLessonKind enum
          0, // EnseignementNormal
          // 1, // ConseilDeClasse
          // 2, // EnseignementRemplacement
          3, // EnseignementHistorique
          4 // EnseignementSuppleant
        ].includes(current.kind)
      ) {
        current._visible = false;
      }
    }
  }

  if (withCanceledClasses && !withSuperposedCanceledClasses) {
    let foundInvisibleCanceled = true;
    while (foundInvisibleCanceled) {
      foundInvisibleCanceled = makeSuperimposedCanceledClassesInvisible(session, classes);
    }
  }


  // @ts-expect-error : we mutate the property even if it's readonly.
  timetable.classes = classes.filter((currentClass) => currentClass._visible !== false);

  // Cleanup.
  for (const current of classes) {
    delete current._visible;
  }
};

/**
 * Returns the end block position of a given class.
 * @param {SessionHandle} session - The current session handle.
 * @param {TimetableClass} givenClass - The class to get the end block position of.
 * @returns {number} The end block position of the class.
 */
const getClassEndBlockPosition = (session: SessionHandle, givenClass: TimetableClass): number => {
  const blocksPerDay = session.instance.blocksPerDay;

  const startBlockPosition = Math.floor(givenClass.blockPosition / blocksPerDay);
  let endBlockPosition = givenClass.blockPosition + givenClass.blockLength - 1;

  if (Math.floor(endBlockPosition / blocksPerDay) !== startBlockPosition) {
    endBlockPosition = startBlockPosition * blocksPerDay + blocksPerDay - 1;
  }

  return endBlockPosition;
};

/**
 * Returns the indexes of the superimposed classes.
 * @param {SessionHandle} session - The current session handle.
 * @param {TimetableClass} classItem - The class to get the superimposed classes of.
 * @param {number} classIndex - The index of the class to get the superimposed classes of.
 * @param {Array<number>} busyPositions - The busy positions of the classes.
 * @returns {Array<number>} The indexes of the superimposed classes.
 */
const getSuperimposedClassesIndexes = (
  session: SessionHandle,
  classItem: TimetableClass,
  classIndex: number,
  busyPositions: number[]
) => {
  const classesSuperimposed = [classIndex];

  const startBlockPosition = classItem.blockPosition;
  const endBlockPosition = getClassEndBlockPosition(session, classItem);

  for (let currentBlockPosition = startBlockPosition; currentBlockPosition <= endBlockPosition; currentBlockPosition++) {
    const busyClassIndex = busyPositions[currentBlockPosition];

    if (typeof busyClassIndex !== "undefined") {
      if (
        busyClassIndex !== classIndex &&
        !classesSuperimposed.includes(busyClassIndex)
      ) classesSuperimposed.push(busyClassIndex);
    }
  }

  return classesSuperimposed;
};


/**
 * Makes the superimposed canceled classes invisible.
 * @param {SessionHandle} session - The current session handle.
 * @param {Array<TimetableClass>} classes - The classes to make invisible.
 * @returns {boolean} True if a class was made invisible, false otherwise.
 */
const makeSuperimposedCanceledClassesInvisible = (session: SessionHandle, classes: temp): boolean => {
  /** key = week number, value */
  const busyPositionsPerWeek: Record<number, number[]> = {};

  for (let classIndex = 0; classIndex < classes.length; classIndex++) {
    const currentClass = classes[classIndex];

    if (!(currentClass.weekNumber in busyPositionsPerWeek)) busyPositionsPerWeek[currentClass.weekNumber] = [];
    const busyPositions = busyPositionsPerWeek[currentClass.weekNumber];

    const startBlockPosition = currentClass.blockPosition;
    const endBlockPosition = getClassEndBlockPosition(session, currentClass);

    if (currentClass._visible !== false) {
      for (let currentBlockPosition = startBlockPosition; currentBlockPosition <= endBlockPosition; currentBlockPosition++) {
        if (typeof busyPositions[currentBlockPosition] === "undefined") {
          busyPositions[currentBlockPosition] = classIndex;
        }
        else {
          const superimposedClassesIndexes = getSuperimposedClassesIndexes(
            session,
            currentClass,
            classIndex,
            busyPositions
          );

          let withCanceledClasses = false;
          let withNormalClasses = false;

          for (let j = 0; j < superimposedClassesIndexes.length; j++) {
            const superimposedClass = classes[superimposedClassesIndexes[j]];

            if (!withNormalClasses) {
              withNormalClasses = !(superimposedClass.is === "lesson" && superimposedClass.canceled);
            }

            if (!withCanceledClasses) {
              withCanceledClasses = superimposedClass.is === "lesson" && superimposedClass.canceled;
            }
          }

          if (withNormalClasses && withCanceledClasses) {
            for (let j = 0; j < superimposedClassesIndexes.length; j++) {
              const superimposedClass = classes[superimposedClassesIndexes[j]];

              if (superimposedClass && superimposedClass.is === "lesson" && superimposedClass.canceled) {
                superimposedClass._visible = false;
                return true;
              }
            }
          }

          break;
        }
      }
    }
  }

  return false;
};
