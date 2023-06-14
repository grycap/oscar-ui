export default [

	{
		path: '*',
		meta: {
		public: true
		},
		redirect: {
		path: '/404'
		}
	},
	{
		path: '/404',
		meta: {
		public: true
		},
		name: 'NotFound',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/sys/NotFound.vue`
		)
	},
	{
		path: '/403',
		meta: {
		public: true
		},
		name: 'AccessDenied',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/sys/Deny.vue`
		)
	},
	{
		path: '/500',
		meta: {
		public: true
		},
		name: 'ServerError',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/sys/Error.vue`
		)
	},
	{
		path: '/login',
		meta: {
		public: true
		},
		name: 'Login',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/Login.vue`
		),
	},
	{
		path: '/ai4eosc',
		meta: {
		public: true
		},
		name: 'ai4eosc',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/landingpages/ai4eosc.vue`
		),
	},{
		path: '/egi',
		meta: {
		public: true
		},
		name: 'egi',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/landingpages/egi.vue`
		),
	},
	{
		path: '/terms-of-use',
		meta: {
		public: true
		},
		name: 'TermOfUse',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/TermOfUse.vue`
		),
	},
	{
		path: '/privacy-policy',
		meta: {
		public: true
		},
		name: 'Privacy',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/Privacy.vue`
		),
	},
	{
		path: '/',
		meta: {
			public: false
		},
		name: 'Root',
		redirect: {
			name: 'Functions'
		}
	},

	{
		path: '/services',
		meta: {
		public: false
		},
		name: 'Layout',
		component: () => import(
		/* webpackChunkName: "routes" */
		/* webpackMode: "lazy" */
		`@/views/Dashboard_layout.vue`
		),
		children: [
			{
				path: '/services',
				meta: {
				public: false
				},
				name: 'Functions',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/Functions.vue`
				)
			},
			{
				path: '/logs/:serviceName',
				meta: {
					public: false
				},
				name: 'Logs',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/Logs.vue`
				)
			},
			{
				path: '/invoke/:serviceName',
				meta: {
					public: false
				},
				name: 'Invoke',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/Invoke.vue`
				)
			},
			{
				path: '/settings',
				meta: {
				public: false
				},
				name: 'Settings',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/Settings.vue`
				),
				props: true
			},
			{
				path: '/buckets/:bucketName',
				meta: {
				public: false
				},
				name: 'BucketContent',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/BucketContent.vue`
				),
				props: true
				},
			{
				path: '/info',
				meta: {
				public: false
				},
				name: 'Info',
				component: () => import(
				/* webpackChunkName: "routes" */
				/* webpackMode: "lazy" */
				`@/views/Info.vue`
				),
				props: true
				},
		]
	},

]
