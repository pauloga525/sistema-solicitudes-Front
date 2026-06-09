export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'localhost:3001';

export const REQUEST_TYPE = {
  PROCESO_MEJORA: 'proceso_mejora',
};

export const REQUEST_STATUS = {
  PENDIENTE: 'pendiente',
  APROBADO: 'aprobado',
  RECHAZADO: 'rechazado',
  EN_REVISION: 'en_revision',
  CANCELADO: 'cancelado',
};

export const COURSE = [
  '1ro_Basica',
  '2do_Basica',
  '3ro_Basica',
  '4to_Basica',
  '5to',
  '6to',
  '7mo',
  '8vo',
  '9no',
  '10mo',
  '1ro_Bach',
  '2do_Bach',
  '3ro_Bach',
];

export const PARALELO = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export const CAMPUS = {
  CARLOS_CRESPI: 'Carlos_Crespi',
  MARIA_AUXILIADORA: 'Maria_Auxiliadora',
  YANUNCAY: 'Yanuncay',
};

export const SUBJECTS_PERMITIDOS = [
  'Matemática',
  'Lengua y literatura',
  'Science',
  'Estudios Sociales',
  'Inglés',
  'ECA',
  'Computación',
  'Animación a la lectura',
  'Educación física',
  'ERE',
  'Razonamiento lógico Matemático',
  'Acompañamiento integral en el Aula',
];
