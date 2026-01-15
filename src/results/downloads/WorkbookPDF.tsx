import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: 'Helvetica' },
    titlePage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        color: 'white',
    },
    mainTitle: { fontSize: 30, marginBottom: 10, fontWeight: 'bold' },
    subTitle: { fontSize: 16, color: '#94a3b8' },

    // Content Pages
    sectionTitle: { fontSize: 20, marginBottom: 15, color: '#0f172a', fontWeight: 'bold' },
    text: { fontSize: 12, lineHeight: 1.6, marginBottom: 10, color: '#334155' },
    worksheetBox: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 5,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        backgroundColor: '#f8fafc',
        minHeight: 100,
    },
    question: { fontSize: 12, fontWeight: 'bold', marginBottom: 5, color: '#2563eb' },
    line: { borderBottomWidth: 1, borderBottomColor: '#cbd5e1', marginTop: 20, marginBottom: 5 },
});

interface WorkbookProps {
    data: {
        lensName: string;
        coreNeed: string;
        fear: string;
        analysis: string;
    };
}

export const WorkbookPDF: React.FC<WorkbookProps> = ({ data }) => (
    <Document>
        {/* Page 1: Cover */}
        <Page size="A4" style={styles.titlePage}>
            <Text style={styles.subTitle}>UnderstandYourPartner</Text>
            <Text style={styles.mainTitle}>4-Week Alignment Workbook</Text>
            <Text style={{ marginTop: 20, fontSize: 14 }}>Profile: {data.lensName.replace('_', ' ')}</Text>
        </Page>

        {/* Page 2: Week 1 - Observation */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Week 1: Observation</Text>
            <Text style={styles.text}>
                Your first task is simple: Notice when your "Lens" activates without doing anything about it.
                You have a dominant pattern of {data.lensName.replace('_', ' ')}.
            </Text>
            <Text style={styles.text}>
                Based on your profile, your core need is "{data.coreNeed}" and your core fear is "{data.fear}".
            </Text>

            <View style={styles.worksheetBox}>
                <Text style={styles.question}>Event Log 1:</Text>
                <Text style={{ fontSize: 10, color: '#64748b' }}>Describe a moment this week where you felt the fear of "{data.fear}".</Text>
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.line} />
            </View>

            <View style={styles.worksheetBox}>
                <Text style={styles.question}>Body Scan:</Text>
                <Text style={{ fontSize: 10, color: '#64748b' }}>Where did you feel it physically? (Chest, throat, stomach?)</Text>
                <View style={styles.line} />
                <View style={styles.line} />
            </View>
        </Page>

        {/* Page 3: Week 2 - Regulation */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.sectionTitle}>Week 2: The Pause</Text>
            <Text style={styles.text}>
                This week, we practice inserting a gap between the Trigger and the Reaction.
            </Text>

            <View style={styles.worksheetBox}>
                <Text style={styles.question}>The Experiment:</Text>
                <Text style={{ fontSize: 10, color: '#64748b' }}>Next time you are triggered, count to 10 before speaking. What happened?</Text>
                <View style={styles.line} />
                <View style={styles.line} />
                <View style={styles.line} />
            </View>
        </Page>
    </Document>
);
