import type { publicEnvironmentVariableSchema } from '@/App.Core/infrastructure/config/public-env-variables/public-env-variable-schema'

export const preProductionEnvironmentVariables: publicEnvironmentVariableSchema = {
  backendApiUrl: 'https://www.elprisenligenu.dk/api/v1/prices/'
}
