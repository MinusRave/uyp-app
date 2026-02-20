
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts if needed, otherwise use standard fonts
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/Roboto-Regular.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 40,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#E11D48', // Red-600
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0F172A', // Slate-900
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B', // Slate-500
    },
    section: {
        margin: 10,
        padding: 10,
    },
    scoreContainer: {
        backgroundColor: '#FFF1F2', // Rose-50
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#FAC7C9', // Rose-200
        marginBottom: 20,
        alignItems: 'center',
    },
    scoreLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#881337', // Rose-900
        marginBottom: 5,
    },
    scoreValue: {
        fontSize: 36,
        fontWeight: 'black',
        color: '#E11D48', // Red-600
    },
    diagnosis: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
        marginTop: 5,
    },
    text: {
        fontSize: 11,
        lineHeight: 1.5,
        color: '#334155', // Slate-700
        marginBottom: 8,
    },
    heading: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
        marginTop: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingBottom: 4,
    },
    warningBox: {
        backgroundColor: '#FEF2F2',
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
        padding: 10,
        marginTop: 10,
    },
    warningText: {
        fontSize: 10,
        color: '#7F1D1D',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 9,
        color: '#94A3B8',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingTop: 10,
    }
});

type ToxicReportProps = {
    date: string;
    score: number;
    riskLevel: string; // "Low", "Medium", "High", "Severe"
    diagnosis: string; // "Covert Narcissist", "Overt Narcissist", etc.
    redFlags: string[];
    recommendation: string;
    // New AI Fields
    executiveSummary?: string;
    tacticalProfile?: string;
    vulnerabilityAssessment?: string;
    strategicOptions?: string;
    next30Days?: string;
};

export const ToxicReportDocument = ({
    date, score, riskLevel, diagnosis, redFlags, recommendation,
    executiveSummary, tacticalProfile, vulnerabilityAssessment, strategicOptions, next30Days
}: ToxicReportProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Toxic Relationship Assessment</Text>
                <Text style={styles.subtitle}>Confidential Report • Generated on {date}</Text>
            </View>

            {/* Score Dashboard */}
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Toxicity Score (0-100)</Text>
                <Text style={styles.scoreValue}>{score}</Text>
                <Text style={styles.diagnosis}>{diagnosis}</Text>
                <Text style={{ fontSize: 10, color: '#881337', marginTop: 5 }}>Risk Level: {riskLevel}</Text>
            </View>

            {/* SECTION 1: EXECUTIVE SUMMARY */}
            {executiveSummary ? (
                <View style={styles.section}>
                    <Text style={styles.heading}>Executive Summary</Text>
                    <Text style={styles.text}>{executiveSummary}</Text>
                </View>
            ) : (
                /* Fallback Summary */
                <View>
                    <Text style={styles.heading}>Analysis Summary</Text>
                    <Text style={styles.text}>
                        Based on your answers, your relationship exhibits specific patterns associated with {diagnosis}.
                        A score of {score} places this dynamic in the {riskLevel} risk category.
                    </Text>
                </View>
            )}

            {/* Immediate Warning for High Risk */}
            {riskLevel === 'Severe' || riskLevel === 'High' ? (
                <View style={styles.warningBox}>
                    <Text style={[styles.heading, { fontSize: 11, marginTop: 0, borderBottomWidth: 0 }]}>CRITICAL WARNING</Text>
                    <Text style={styles.warningText}>
                        This score indicates a highly dangerous dynamic. The behaviors reported (such as gaslighting, control, or aggression) are not typical relationship problems—they are structural abuse tactics.
                    </Text>
                </View>
            ) : null}

            {/* SECTION 2: TACTICAL PROFILE */}
            {tacticalProfile && (
                <View style={styles.section}>
                    <Text style={styles.heading}>Her Tactical Profile</Text>
                    <Text style={styles.text}>{tacticalProfile}</Text>
                </View>
            )}

            {/* SECTION 3: VULNERABILITY ASSESSMENT */}
            {vulnerabilityAssessment && (
                <View style={styles.section}>
                    <Text style={styles.heading}>Your Vulnerability Assessment</Text>
                    <Text style={styles.text}>{vulnerabilityAssessment}</Text>
                </View>
            )}

            {/* Red Flags and Recommendation (Always show as backup or supplemental) */}
            <View style={styles.section}>
                <Text style={styles.heading}>Critical Flags Detected</Text>
                {redFlags.length > 0 ? (
                    redFlags.map((flag, i) => (
                        <Text key={i} style={styles.text}>• {flag}</Text>
                    ))
                ) : (
                    <Text style={styles.text}>No critical red flags detected in the core categories.</Text>
                )}
            </View>

            {/* SECTION 4: STRATEGIC OPTIONS */}
            {strategicOptions ? (
                <View style={styles.section}>
                    <Text style={styles.heading}>Strategic Options</Text>
                    <Text style={styles.text}>{strategicOptions}</Text>
                </View>
            ) : (
                <View>
                    <Text style={styles.heading}>Recommended Action</Text>
                    <Text style={styles.text}>
                        {recommendation}
                    </Text>
                </View>
            )}

            {/* SECTION 5: NEXT 30 DAYS */}
            {next30Days && (
                <View style={styles.section}>
                    <Text style={styles.heading}>Next 30 Days Action Plan</Text>
                    <Text style={styles.text}>{next30Days}</Text>
                </View>
            )}

            {/* Disclaimer / Footer */}
            <View style={styles.footer}>
                <Text>
                    This report is for informational purposes only and does not constitute a clinical diagnosis.
                    If you feel unsafe, please contact local emergency services immediately.
                </Text>
                <Text style={{ marginTop: 4 }}>© UnderstandYourPartner.com</Text>
            </View>

        </Page>
    </Document>
);
