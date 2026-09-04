export const profile = {
	fullName: 'Ilyes Baali',
	title: '',
	institute: 'Weill Cornell Medicine / Memorial Sloan Kettering Cancer Center',
	bio: 'I am a computational biologist working on machine learning for RNA biology and translational oncology. My research asks how RNA-binding proteins choose their targets in cells, and how much of what we measure in vivo actually reflects that choice.',
	author_name: 'Baali', // Author name to be highlighted in the papers section
	research_areas: [
		{
			title: 'RNA-Binding Proteins',
			description:
				'Post-transcriptional regulation and how RNA-binding proteins choose their targets in cells.',
			field: 'biology',
		},
		{
			title: 'Machine Learning for Genomics',
			description:
				'Protein language models and genomic sequence-to-function models applied to functional genomics.',
			field: 'computer-science',
		},
		{
			title: 'Translational Oncology',
			description:
				'Translational control of leukemic stem-cell programs and driver-module discovery in cancer.',
			field: 'biology',
		},
		{
			title: 'AI Agents for Science',
			description:
				'Agentic pipelines that plan, call scientific tools, and synthesize evidence for biological questions.',
			field: 'engineering',
		},
	],
}

// Set equal to an empty string to hide the icon that you don't want to display
export const social = {
	email: 'ilb4001@med.cornell.edu',
	linkedin: 'https://linkedin.com/in/ilyesbaali',
	x: 'https://x.com/ilyes_baali07',
	bluesky: '',
	github: 'https://github.com/ilyes495',
	gitlab: '',
	scholar: 'https://scholar.google.com/citations?user=rcsFYm8AAAAJ',
	inspire: '',
	arxiv: '',
	orcid: '',
}

export const template = {
	website_url: 'https://ilyesbaali.me',
	menu_left: false,
	transitions: true,
	lightTheme: 'light',
	darkTheme: 'dark',
	excerptLength: 200,
	postPerPage: 5,
	base: '',
}

export const seo = {
	default_title: 'Ilyes Baali',
	default_description:
		'Computational biologist working on machine learning for RNA biology and translational oncology.',
	default_image: '/images/og-image.png',
}
