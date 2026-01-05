// Error messages
export const ErrorMessages = {
  UNAUTHORIZED: "Non authentifié",
  INVALID_TOKEN: "Token invalide",
  FORBIDDEN: "Non autorisé",
  NOT_FOUND: "Ressource non trouvée",
  INVALID_DATA: "Données invalides",
  INTERNAL_ERROR: "Erreur interne du serveur",
  
  // Specific errors
  USER_EXISTS: "Cet email est déjà utilisé",
  INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
  SCHOOL_NOT_FOUND: "École non trouvée",
  CLASS_NOT_FOUND: "Classe non trouvée",
  EXAM_NOT_FOUND: "Examen non trouvé",
  INVITATION_NOT_FOUND: "Invitation non trouvée",
  SUBMISSION_NOT_FOUND: "Soumission non trouvée",
  USER_NOT_FOUND: "Utilisateur non trouvé",
  
  // Enrollment errors
  STUDENT_NOT_ROLE: "Cet utilisateur n'est pas un élève",
  ALREADY_ENROLLED: "Cet élève est déjà inscrit à cette classe",
  
  // Exam errors
  INVALID_DATE_RANGE: "La date de fin doit être après la date de début",
  EXAM_NOT_STARTED: "L'examen n'a pas encore commencé",
  EXAM_ENDED: "L'examen est terminé",
  ALREADY_SUBMITTED: "Vous avez déjà soumis une réponse pour cet examen",
  
  // Server errors
  CREATE_SCHOOL_ERROR: "Erreur lors de la création de l'école",
  CREATE_CLASS_ERROR: "Erreur lors de la création de la classe",
  CREATE_EXAM_ERROR: "Erreur lors de la création de l'examen",
  CREATE_INVITATION_ERROR: "Erreur lors de la création des invitations",
  SUBMIT_EXAM_ERROR: "Erreur lors de la soumission de l'examen",
  ENROLL_STUDENT_ERROR: "Erreur lors de l'inscription de l'élève",
  GET_SCHOOLS_ERROR: "Erreur lors de la récupération des écoles",
  GET_EXAMS_ERROR: "Erreur lors de la récupération des examens",
  GET_SUBMISSIONS_ERROR: "Erreur lors de la récupération des soumissions",
  GET_INVITATIONS_ERROR: "Erreur lors de la récupération des invitations",
  DELETE_ERROR: "Erreur lors de la suppression",
};

// Success messages
export const SuccessMessages = {
  CREATED: "Créé avec succès",
  UPDATED: "Mis à jour avec succès",
  DELETED: "Supprimé avec succès",
  SUBMITTED: "Soumis avec succès",
};

// HTTP Status Codes
export const StatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// Invitation statuses
export const InvitationStatus = {
  PENDING: "PENDING",
  STARTED: "STARTED",
  SUBMITTED: "SUBMITTED",
  EXPIRED: "EXPIRED",
} as const;

// User roles
export const UserRole = {
  PROF: "PROF",
  STUDENT: "STUDENT",
} as const;

// Configuration
export const Config = {
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  MAX_INVITATION_TOKEN_LENGTH: 64,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
};
