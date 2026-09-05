export const profile = {
	fullName: 'Ilyes Baali',
	title: '',
	institute: 'Weill Cornell Medicine / Memorial Sloan Kettering Cancer Center',
	bio: [
		'I completed my PhD at the <a class="link link-secondary" href="https://compbio.triiprograms.org/">Tri-I Computational Biology and Medicine program</a> at Weill Cornell Medicine and Memorial Sloan Kettering Cancer Center, supervised by <a class="link link-secondary" href="http://www.morrislab.ai/">Quaid Morris</a>, and I continue to work in the Morris Lab.',
		'I am interested in the application of machine learning methods to functional genomics, particularly in understanding post-transcriptional regulation. My work improves the prediction of cellular binding sites of RNA-binding proteins by integrating both in vivo and in vitro data using a recalibration framework. I am also interested in developing genomic foundation models. Other than that, I collaborate with <a class="link link-secondary" href="https://www.mskcc.org/research/ski/labs/michael-kharas">Michael Kharas\' lab</a> to understand the role of MSI2-RBP in AML.',
		'Previously, I completed my BSc and MSc at Antalya Bilim University in Electrical &amp; Electronics Engineering and Computer Engineering, under the supervision of <a class="link link-secondary" href="https://scholar.google.com/citations?user=vxtfpUQAAAAJ&amp;hl=en">Hilal Kazan</a>.',
	],
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
	email: 'baali.ilyes@gmail.com',
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

// Comments are GitHub Discussions via giscus. Fill these in from giscus.app
// after enabling Discussions and installing the giscus app on the repository.
// See docs/comments.md. Leave enabled false to hide the section entirely.
export const comments = {
	enabled: false,
	repo: '', // e.g. 'ilyes495/ilyesbaali.me'
	repoId: '',
	category: 'Comments',
	categoryId: '',
}

export const seo = {
	default_title: 'Ilyes Baali',
	default_description:
		'Computational biologist working on machine learning for RNA biology and translational oncology.',
	default_image: '/images/og-image.png',
}
