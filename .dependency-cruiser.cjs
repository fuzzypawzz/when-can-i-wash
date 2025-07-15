/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    // UI layer must not depend directly on the Service layer
    {
      name: 'UI layer must not depend directly on the Service layer',
      severity: 'error',
      comment: 'UI should not skip layers. Use the logic layer to reach the service layer.',
      from: { path: 'App.UI', pathNot: '\\.test|.test-harness|.spec\\.(js|ts)$|\\.d\\.ts$' },
      to: { path: 'App.Service' }
    },
    // Service layer should not depend on Logic or UI
    {
      name: 'Service layer should not depend on Logic layer',
      severity: 'error',
      comment: 'Service layer should not know about what is going on in the logic layer, ever.',
      from: { path: 'App.Service' },
      to: { path: 'App.Logic' }
    },
    {
      name: 'Service layer should not depend on the UI layer',
      severity: 'error',
      comment: 'Service layer should not know about what is going on in the UI layer, ever.',
      from: { path: 'App.Service' },
      to: { path: 'App.UI' }
    },
    // Logic layer should not depend on UI
    {
      name: 'Logic layer should not depend on the UI layer',
      severity: 'error',
      comment: 'Logic layer should not know about what is going on in the UI layer, ever.',
      from: { path: 'App.Logic' },
      to: { path: 'App.UI' }
    },
    /**
     * @description HTTP GATEWAY
     */
    {
      name: 'Do only access HttpGateway from the Logic layer',
      severity: 'error',
      comment: 'We should only reach out to the network through the service layer.',
      from: {
        path: 'App.Logic',
        pathNot: '\.test|.test-harness|.spec\.(js|ts)$|\.d\.ts$'
      },
      to: { path: 'http-gateway' }
    },
    {
      name: 'Do not access HttpGateway from the UI layer',
      severity: 'error',
      comment: 'We should only reach out to the network through the service layer.',
      from: {
        path: 'App.UI',
        pathNot: '\.test|.test-harness|.spec\.(js|ts)$|\.d\.ts$'
      },
      to: { path: 'http-gateway' }
    },
    /**
     * @description ROUTER
     */
    {
      name: 'The router should not be used directly, but appRouter should be used instead.',
      severity: 'error',
      comment:
        'Do not use the router object directly. Use the appRouter abstraction instead.' +
        'The application can become hard to maintain/refactor if the whole app is using the router directly.',
      from: {
        path: '/',
        pathNot: ['app-router', 'app-test-harness', 'route-table', 'node_modules']
      },
      to: {
        path: 'react-router',
        dependencyTypesNot: ['type-only']
      }
    }
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
      mainFields: ['main', 'types', 'typings']
    }
  }
}
