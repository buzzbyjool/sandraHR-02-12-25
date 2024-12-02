import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Sidebar
      sidebar: {
        dashboard: 'Dashboard',
        pipeline: 'Pipeline',
        candidates: 'Candidates',
        jobs: 'Jobs',
        settings: 'Settings',
        archive: 'Archives'
      },

      // Search
      search: {
        placeholder: 'Search by name, job, or organization...'
      },

      // Dashboard
      dashboard: {
        title: 'Dashboard',
        interviews: 'Interviews',
        candidates: 'Candidates',
        positions: 'Positions',
        hired: 'Hired',
        metrics: 'Metrics',
        activities: 'Recent Activities',
        status: {
          pending: 'Pending',
          completed: 'Completed'
        }
      },

      // Jobs
      jobs: {
        title: 'Jobs',
        add: 'Add Job',
        edit: 'Edit Job',
        details: 'Job Details',
        requirements: 'Requirements',
        department: 'Department',
        location: 'Location',
        type: 'Type',
        description: 'Description',
        view_pipeline: 'View Pipeline',
        delete_confirm_title: 'Delete Job',
        delete_confirm_message: 'Are you sure you want to delete {{jobTitle}}? This will remove all candidate associations.',
        delete_success: 'Successfully deleted {{title}} and {{count}} candidate associations',
        delete_error: 'Failed to delete job',
        candidate_added: 'Candidate added successfully',
        candidate_add_error: 'Failed to add candidate'
      },

      // Pipeline
      pipeline: {
        title: 'Pipeline',
        add: 'Add Candidate',
        stages: {
          new: 'New',
          screening: 'Screening',
          interview: 'Interview',
          submitted: 'Submitted',
          hr: 'HR Interview',
          manager: 'Manager Interview'
        }
      },

      // Profile
      profile: {
        title: 'Profile',
        view: 'View Profile',
        personal_info: 'Personal Information',
        company_info: 'Company Information',
        email: 'Email Address',
        name: 'Full Name',
        name_updated: 'Name updated successfully',
        update_failed: 'Update failed',
        change_password: 'Change Password',
        current_password: 'Current Password',
        new_password: 'New Password',
        confirm_password: 'Confirm Password',
        passwords_not_match: 'Passwords do not match',
        password_updated: 'Password updated successfully',
        wrong_password: 'Current password is incorrect',
        update_password: 'Update Password'
      },

      // Company
      company: {
        title: 'Company',
        setup_title: 'Set Up Your Company',
        team: 'Team',
        unknown_company: 'Unknown Company',
        role: 'Role',
        setup_description: 'Create a company profile to start managing your recruitment process.',
        name: 'Company Name',
        domain: 'Company Domain',
        name_placeholder: 'Enter your company name',
        domain_help: 'Used for email verification and team invites',
        create: 'Create Company',
        create_error: 'Failed to create company',
        no_company: 'You haven\'t set up a company yet',
        contact_admin: 'Please contact an administrator to be added to a company'
      },

      // Common
      common: {
        loading: 'Loading...',
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        add: 'Add',
        adding: 'Adding...',
        update: 'Update',
        updating: 'Updating...',
        creating: 'Creating...',
        delete: 'Delete',
        deleting: 'Deleting...',
        edit: 'Edit',
        clear: 'Clear',
        create: 'Create'
      },

      // Status
      status: {
        pending: 'Pending',
        completed: 'Completed',
        active: 'Active',
        inactive: 'Inactive'
      },

      // Auth
      auth: {
        signout: 'Sign Out',
        forgot_password: 'Forgot your password?',
        reset_password: 'Reset Password',
        reset_password_sent: 'Password reset email sent',
        reset_password_error: 'Failed to send password reset email'
      },

      // Errors
      errors: {
        add_candidate: 'Failed to add candidate',
        update_candidate: 'Failed to update candidate',
        delete_candidate: 'Failed to delete candidate'
      },

      // Candidates
      candidate: {
        firstName: 'First Name',
        surname: 'Last Name',
        email: 'Email',
        phone: 'Phone',
        position: 'Position',
        address: 'Address',
        nationality: 'Nationality',
        workPermits: 'Work Permits',
        euResident: 'EU Resident',
        euWorkPermit: 'EU Work Permit',
        assessment: 'Assessment',
        aiSalaryEstimation: 'AI Salary Estimation',
        recruiterFeedback: 'Recruiter Feedback',
        additionalInfo: 'Additional Personal Information'
      }
    }
  },
  fr: {
    translation: {
      // Sidebar
      sidebar: {
        dashboard: 'Tableau de bord',
        pipeline: 'Pipeline',
        candidates: 'Candidats',
        jobs: 'Emplois',
        settings: 'Paramètres',
        archive: 'Archives'
      },

      // Search
      search: {
        placeholder: 'Rechercher par nom, poste ou organisation...'
      },

      // Dashboard
      dashboard: {
        title: 'Tableau de bord',
        interviews: 'Entretiens',
        candidates: 'Candidats',
        positions: 'Postes',
        hired: 'Recrutés',
        metrics: 'Métriques',
        activities: 'Activités récentes',
        status: {
          pending: 'En attente',
          completed: 'Terminé'
        }
      },

      // Jobs
      jobs: {
        title: 'Emplois',
        add: 'Ajouter un emploi',
        edit: 'Modifier l\'emploi',
        details: 'Détails du poste',
        requirements: 'Prérequis',
        department: 'Département',
        location: 'Localisation',
        type: 'Type',
        description: 'Description',
        view_pipeline: 'Voir le pipeline',
        delete_confirm_title: 'Supprimer l\'emploi',
        delete_confirm_message: 'Êtes-vous sûr de vouloir supprimer {{jobTitle}} ? Cela supprimera toutes les associations de candidats.',
        delete_success: 'Suppression réussie de {{title}} et {{count}} associations de candidats',
        delete_error: 'Échec de la suppression de l\'emploi',
        candidate_added: 'Candidat ajouté avec succès',
        candidate_add_error: 'Échec de l\'ajout du candidat'
      },

      // Pipeline
      pipeline: {
        title: 'Pipeline',
        add: 'Ajouter un candidat',
        stages: {
          new: 'Nouveau',
          screening: 'Présélection',
          interview: 'Entretien',
          submitted: 'Soumis',
          hr: 'Entretien RH',
          manager: 'Entretien Manager'
        }
      },

      // Profile
      profile: {
        title: 'Profil',
        view: 'Voir le profil',
        personal_info: 'Informations personnelles',
        company_info: 'Informations de l\'entreprise',
        email: 'Adresse email',
        name: 'Nom complet',
        name_updated: 'Nom mis à jour avec succès',
        update_failed: 'Échec de la mise à jour',
        change_password: 'Changer le mot de passe',
        current_password: 'Mot de passe actuel',
        new_password: 'Nouveau mot de passe',
        confirm_password: 'Confirmer le mot de passe',
        passwords_not_match: 'Les mots de passe ne correspondent pas',
        password_updated: 'Mot de passe mis à jour avec succès',
        wrong_password: 'Le mot de passe actuel est incorrect',
        update_password: 'Mettre à jour le mot de passe'
      },

      // Company
      company: {
        title: 'Entreprise',
        setup_title: 'Configurer votre entreprise',
        team: 'Équipe',
        role: 'Rôle',
        setup_description: 'Créez un profil d\'entreprise pour commencer à gérer votre processus de recrutement.',
        name: 'Nom de l\'entreprise',
        domain: 'Domaine de l\'entreprise',
        name_placeholder: 'Entrez le nom de votre entreprise',
        domain_help: 'Utilisé pour la vérification des emails et les invitations d\'équipe',
        create: 'Créer l\'entreprise',
        create_error: 'Échec de la création de l\'entreprise',
        no_company: 'Vous n\'avez pas encore configuré d\'entreprise',
        contact_admin: 'Veuillez contacter un administrateur pour être ajouté à une entreprise'
      },

      // Common
      common: {
        loading: 'Chargement...',
        save: 'Enregistrer',
        saving: 'Enregistrement...',
        cancel: 'Annuler',
        add: 'Ajouter',
        adding: 'Ajout...',
        update: 'Mettre à jour',
        updating: 'Mise à jour...',
        creating: 'Création...',
        delete: 'Supprimer',
        deleting: 'Suppression...',
        edit: 'Modifier',
        clear: 'Effacer',
        create: 'Créer'
      },

      // Status
      status: {
        pending: 'En attente',
        completed: 'Terminé',
        active: 'Actif',
        inactive: 'Inactif'
      },

      // Auth
      auth: {
        signout: 'Déconnexion',
        forgot_password: 'Mot de passe oublié ?',
        reset_password: 'Réinitialiser le mot de passe',
        reset_password_sent: 'Email de réinitialisation envoyé',
        reset_password_error: 'Échec de l\'envoi de l\'email de réinitialisation'
      },

      // Errors
      errors: {
        add_candidate: 'Échec de l\'ajout du candidat',
        update_candidate: 'Échec de la mise à jour du candidat',
        delete_candidate: 'Échec de la suppression du candidat'
      },

      // Candidates
      candidate: {
        firstName: 'Prénom',
        surname: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        position: 'Poste',
        address: 'Adresse',
        nationality: 'Nationalité',
        workPermits: 'Permis de travail',
        euResident: 'Résident UE',
        euWorkPermit: 'Permis de travail UE',
        assessment: 'Évaluation',
        aiSalaryEstimation: 'Estimation IA du salaire',
        recruiterFeedback: 'Retour du recruteur',
        additionalInfo: 'Informations personnelles supplémentaires'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;