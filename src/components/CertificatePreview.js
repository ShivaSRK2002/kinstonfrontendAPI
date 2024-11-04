import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';

const CertificatePreview = () => {
    const { courseId } = useParams(); // Get the courseId from URL params
    const [course, setCourse] = useState(null); // Store course data
    const [pdfUrl, setPdfUrl] = useState(null); // Store the PDF blob URL for preview

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                // Fetch course details using courseId (replace the URL with your API)
                const response = await axios.get(`http://localhost:5148/api/Courses/${courseId}`);
                setCourse(response.data);

                // Generate the certificate preview
                generateCertificate(response.data);
            } catch (err) {
                console.error("Error fetching course details:", err);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    const generateCertificate = (course) => {
        const doc = new jsPDF('landscape'); // Landscape orientation for a certificate
        const date = new Date().toLocaleString();

        // Define styles
        const headingFontSize = 24;
        const subheadingFontSize = 16;
        const bodyFontSize = 12;
        const signatureFontSize = 18;

        // Add borders or decorative elements (optional)
        doc.setLineWidth(1);
        doc.rect(10, 10, 270, 190); // Outer border for the certificate

        // University Name - Heading
        doc.setFont("helvetica", "bold");
        doc.setFontSize(headingFontSize);
        doc.text("Kinston E-Learning University", doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

        // Date
        doc.setFontSize(bodyFontSize);
        doc.setFont("helvetica", "normal");
        doc.text(`Date: ${date}`, doc.internal.pageSize.getWidth() - 50, 50);

        // Certificate Body Content
        doc.setFontSize(subheadingFontSize);
        doc.setFont("helvetica", "bold");
        doc.text("Certificate of Completion", doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

        doc.setFontSize(bodyFontSize);
        doc.setFont("helvetica", "normal");
        doc.text("This certifies that", doc.internal.pageSize.getWidth() / 2, 80, { align: 'center' });

        // Student's Name (replace "[Your Name]" with actual name)
        doc.setFontSize(subheadingFontSize);
        doc.setFont("helvetica", "bold");
        doc.text("[Your Name]", doc.internal.pageSize.getWidth() / 2, 100, { align: 'center' });

        // Course Information
        doc.setFontSize(bodyFontSize);
        doc.setFont("helvetica", "normal");
        doc.text(`has successfully completed the course:`, doc.internal.pageSize.getWidth() / 2, 120, { align: 'center' });

        doc.setFontSize(subheadingFontSize);
        doc.setFont("helvetica", "bold");
        doc.text(course.title, doc.internal.pageSize.getWidth() / 2, 140, { align: 'center' });

        doc.setFontSize(bodyFontSize);
        doc.setFont("helvetica", "normal");
        doc.text(`Course Description: ${course.description}`, doc.internal.pageSize.getWidth() / 2, 160, { align: 'center' });
        doc.text(`Start Date: ${new Date(course.startDate).toLocaleDateString()}`, 60, 180);
        doc.text(`End Date: ${new Date(course.endDate).toLocaleDateString()}`, 160, 180);

        // Signature
        doc.setFontSize(signatureFontSize);
        doc.text("Digitally Signed", doc.internal.pageSize.getWidth() - 60, 200);

        // Generate PDF Blob URL for Preview
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
    };

    const downloadCertificate = () => {
        const doc = new jsPDF('landscape'); // same process to generate the certificate for download
        // ... Add content again here
        doc.save(`${course.title}_Certificate.pdf`); // Save the certificate
    };

    return (
        <div style={styles.container}>
            <h2>Certificate Preview</h2>
            {pdfUrl ? (
                <iframe
                    src={pdfUrl}
                    title="Certificate Preview"
                    width="100%"
                    height="500px"
                    style={styles.preview}
                />
            ) : (
                <p>Loading certificate preview...</p>
            )}

            <Button
                variant="contained"
                color="primary"
                onClick={downloadCertificate}
                style={styles.downloadButton}
            >
                Download Certificate
            </Button>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: 'auto',
        textAlign: 'center',
    },
    preview: {
        border: '1px solid #ccc',
        marginTop: '20px',
    },
    downloadButton: {
        marginTop: '20px',
    },
};

export default CertificatePreview;
