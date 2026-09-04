export const experiences = [
	{
		company: 'Morris Lab, Memorial Sloan Kettering Cancer Center & Weill Cornell Medicine',
		time: 'Jul 2021 - Present',
		title: 'Doctoral Researcher',
		location: 'New York, NY',
		description:
			'Built an RBP-agnostic CLIP model to test whether eCLIP binding reflects an RNA-binding protein’s intrinsic sequence specificity, and reanalyzed 240+ ENCODE experiments with it. Developed an intrinsic-specificity score that flags non-sequence-specific binding without in vitro data. Benchmarked protein language model and AlphaFold-derived representations, built Nextflow pipelines on HPC clusters for CLIP, RNA-seq and Ribo-seq data, and showed that MSI2 promotes translation of a leukemic stem-cell program in AML.',
	},
	{
		company: 'Morris Lab, University of Toronto',
		time: 'Jun 2019 - Sep 2019',
		title: 'Visiting Researcher',
		location: 'Toronto, Canada',
		description:
			'Designed and implemented a multitask deep learning model in PyTorch to predict in vivo RBP binding sites from in vitro binding preferences using paired RNAcompete and eCLIP data.',
	},
	{
		company: 'Computational Biology Lab, Antalya Bilim University',
		time: 'Oct 2018 - Jul 2020',
		title: 'Research Assistant',
		location: 'Antalya, Turkey',
		description:
			'Developed DriveWays, a graph-based algorithm for identifying overlapping cancer driver modules from TCGA multi-omics data, and ran the classification and survival analyses for MEXCOwalk.',
	},
	{
		company: 'Machine Learning Lab, Antalya Bilim University',
		time: 'Oct 2016 - Aug 2017',
		title: 'Senior Project Student',
		location: 'Antalya, Turkey',
		description:
			'Integrated gene expression and aCGH data to improve prediction of survival and clinical outcome in neuroblastoma for the CAMDA 2017 challenge.',
	},
	{
		company: 'Digital Media & Data Reconstruction Lab, Shanghai Jiao Tong University',
		time: 'Jun 2016 - Sep 2016',
		title: 'Summer Research Intern',
		location: 'Shanghai, China',
		description:
			'Built a face recognition system based on GoogLeNet, achieving 94% accuracy on the LFW benchmark.',
	},
]

export const education = [
	{
		school: 'Weill Cornell Medicine / Memorial Sloan Kettering Cancer Center',
		time: '',
		degree: 'Ph.D. in Computational Biology',
		location: 'New York, NY',
		description:
			'Tri-Institutional PhD Program in Computational Biology & Medicine. Dissertation on cellular context in protein–RNA interactions, advised by Prof. Quaid Morris.',
	},
	{
		school: 'Antalya Bilim University',
		time: '',
		degree: 'M.Sc. in Computer Engineering',
		location: 'Antalya, Turkey',
		description:
			'Thesis: DriveWays, identification of overlapping cancer driver modules from multi-omics data.',
	},
	{
		school: 'Antalya Bilim University',
		time: '',
		degree: 'B.Sc. in Computer Engineering and B.Sc. in Electrical & Electronics Engineering',
		location: 'Antalya, Turkey',
		description: 'Graduated with high honors in both departments; best senior project award.',
	},
]

export const skills = [
	{
		title: 'Multi-omics',
		description:
			'RNA-seq (bulk and single-cell), spatial transcriptomics (10x Visium), CLIP-seq (iCLIP/eCLIP), Ribo-seq and RiboSTAMP, HyperTRIBE, differential expression, survival analysis',
	},
	{
		title: 'Machine learning',
		description:
			'PyTorch, Keras, TensorFlow; protein language models (ESM), AlphaFold integration, genomic sequence-to-function models; Bayesian inference (NumPyro); LLM tooling and agents for scientific workflows',
	},
	{
		title: 'Pipelines and HPC',
		description: 'Nextflow, Snakemake, SLURM cluster computing, Docker, git, reproducible research practices',
	},
	{
		title: 'Programming',
		description: 'Python (10+ years), R, C/C++, Java, MATLAB, SQL',
	},
	{
		title: 'Languages',
		description: 'English (fluent), Arabic (bilingual), French (professional), Turkish (conversational)',
	},
]

export const publications = [
	{
		title: 'ZFP36L2 orchestrates stress-adaptive plasticity in regeneration and cancer',
		authors: 'Q. Jiang, M. S. Raghavan, A. M. Rodriguez, M. Lallo, I. Baali, et al., Q. Morris, J. M. Chan, K. Ganesh',
		journal: 'Nature',
		time: '2026',
		link: 'https://www.nature.com/articles/s41586-026-10890-0',
		abstract:
			'The RNA-binding protein ZFP36L2 acts as a stress-responsive orchestrator of dedifferentiation in intestinal regeneration and colorectal cancer metastasis.',
	},
	{
		title: 'A dynamic RNA-binding protein module coordinates translation of leukemic stemness programs',
		authors: 'X. Xie*, F. Herrejon Chavez*, I. Baali*, et al., D. T. T. Nguyen, M. G. Kharas',
		journal: 'In review',
		time: '2026',
		link: '',
		abstract:
			'A cooperative RBP module centered on MSI2 controls translation of a leukemic stem-cell program in AML. Co-first author.',
	},
	{
		title: 'mRNABench: a curated benchmark for mature mRNA property and function prediction',
		authors: 'R. Shi, T. Dalal, P. Fradkin, D. Koyyalagunta, I. Baali, B. Wang, Q. Morris',
		journal: 'bioRxiv',
		time: '2025',
		link: 'https://doi.org/10.1101/2025.07.05.662870',
		abstract:
			'A benchmarking suite of curated datasets and prediction tasks for evaluating mature mRNA representations from nucleotide foundation models.',
	},
	{
		title: 'Uncovering the HOXA9 translational regulatory complex that promotes AML leukemic stem cells',
		authors: 'X. Xie*, F. Herrejon Chavez*, I. Baali*, et al., M. G. Kharas',
		journal: 'Blood (ASH Annual Meeting abstract)',
		time: '2024',
		link: 'https://ashpublications.org/blood/article/144/Supplement%201/4106/529586/',
		abstract:
			'Identification of RNA-binding proteins that bind MSI2 and co-regulate HOXA9-associated programs in leukemic stem cells.',
	},
	{
		title: 'DriveWays: a method for identifying possibly overlapping driver pathways in cancer',
		authors: 'I. Baali, C. Erten, H. Kazan',
		journal: 'Scientific Reports',
		time: '2020',
		link: 'https://www.nature.com/articles/s41598-020-78852-8',
		abstract:
			'A seed-and-extend heuristic that identifies overlapping cancer driver modules from a protein interaction network and multi-omics data.',
	},
	{
		title: 'MEXCOwalk: mutual exclusion and coverage based random walk to identify cancer modules',
		authors: 'R. Ahmed, I. Baali, C. Erten, E. Hoxha, H. Kazan',
		journal: 'Bioinformatics',
		time: '2020',
		link: 'https://academic.oup.com/bioinformatics/article/36/3/872/5552148',
		abstract:
			'A random-walk method that combines mutual exclusivity and coverage to discover cancer driver modules.',
	},
	{
		title: 'Machine learning for wearable IoT-based applications: a survey',
		authors: 'F. Al-Turjman, I. Baali',
		journal: 'Transactions on Emerging Telecommunications Technologies',
		time: '2019',
		link: '',
		abstract: 'A survey of machine learning methods applied to wearable Internet-of-Things applications.',
	},
	{
		title: 'Predicting clinical outcomes in neuroblastoma with genomic data integration',
		authors: 'I. Baali, A. E. Acar, T. Aderinwale, S. HafezQorani, H. Kazan',
		journal: 'Biology Direct',
		time: '2018',
		link: 'https://biologydirect.biomedcentral.com/articles/10.1186/s13062-018-0223-8',
		abstract:
			'Integration of gene expression and aCGH data to improve prediction of survival and clinical outcome in neuroblastoma.',
	},
]
