<template>
    <div>
        <v-footer app color="teal darken-2">
            <v-layout row wrap align-center>
            <v-flex xs10>
                <div class="white--text ml-4">
                    <h5>© 2022, <a style="color:#ff9966;font-size:1rem" href="https://www.grycap.upv.es">GRyCAP-I3M-UPV</a>, Universitat Politècnica de Valéncia, Spain.</h5>
                </div>
            </v-flex>
            <v-flex xs2  v-show="env.deploy_container === 'false'">

            <v-dialog  id="vdiag" lazy v-model="term"  :fullscreen="$vuetify.breakpoint.xs" max-width="70%">
              <h5 slot="activator" dark class="mb-2"  style="color:#ff9966;font-size:1rem">
                Terms of Use
              </h5>
              <v-card >
                  <div  style="padding:50px">
                  <div style="float: right">
                  <v-btn  @click="term = false">Close</v-btn>
                </div>

                  <h1 >Terms of Use</h1>
                    <p>
                    Thank you for visiting the <b>OSCAR</b> website provided by the <a href="http://www.grycap.upv.es">GRyCAP</a> research group from the <a href="http://www.i3m.upv.es/">Instituto de Instrumentación para Imagen Molecular (I3M)</a> at the <a href="http://www.upv.es">Universitat Politécnica de València (UPV)</a>, located at Camino de Vera S/N, Spain (the “Provider”). These Terms of Use (“TOU”) represent a binding legal contract between you and the Provider. The TOU mandate your access to and the use of Provider’s website, together with all content, services available at or through any service linking to this TOU (the “Services”).
                    </br></br>
                    <b>IMPORTANT:</b> Please read the TOU carefully before using any of the Services. Using any of the Services states that you accept and agree to be bound by the TOU.  Services must not be used unless you accept the TOU.  The Provider may change or modify the Services or the TOU at any time.  Such changes, revisions, or modifications shall be effective immediately upon being posted in relation to the Services.  Any use of the Services by you after we post changes to the TOU constitutes your acceptance of those changes.
                    </br></br>
                    THESE TOU CONTAIN DISCLAIMERS OF WARRANTIES (SECTION 4), DISCLAIMERS OF LIABILITY AND AN EXCLUSIVE REMEDY (SECTION 5), AS WELL AS INFORMATION ABOUT CERTAIN LIMITATIONS ON YOUR ABILITY TO BRING A CLAIM AGAINST US (SECTION 10).
                    </br></br>
                    The minimum age to use the Services is 16 years. Services are only offered to users that are at least 16 years old.  Any person who registers  as a user or provides his/her personal information on the Services represents that he/she is 16 years of age or older.
                    </br>
                    </p>
                  <h2>1. Access and Use of the Services</h2>
                    <p>
                    You must not access or use the Services for any unlawful or unauthorized purpose. International users agree to comply with all local laws regarding privacy and the protection of personal data, online conduct and the legality of content.
                    </br></br>
                    You may not access or use, or attempt to access or use, the Services to take any action that could harm us or any person or entity (a “person”), interfere with the operation of the Services, or use the Services in a manner that violates any laws.  For example, and without limitation, you may not:
                    </br></br>
                    <ul>
                        <li>Impersonate any person or falsely state or otherwise misrepresent your credentials, affiliation with any person, or the origin of any information you provide;</li>
                        <li>Engage in unauthorized spidering, scraping, or harvesting of content or information, or use any other unauthorized automated means to compile information;</li>
                        <li>Obtain or attempt to gain unauthorized access to other computer systems, materials, information or any services available on or through the Services;</li>
                        <li>Use any device, software, or routine to interfere or attempt to interfere with the proper working of the Services or any activity conducted on the Services or attempt to probe, scan, test the vulnerability of, or breach the security of any system, device or network;</li>
                        <li>Circumvent, reverse engineer, decipher, decompile, disassemble, decrypt, or otherwise alter or interfere with (or attempt, encourage, or support anyone else’s attempt to engage in such activities) any of the software comprising or in any way making up a part of the Services. The use or distribution of tools designed for compromising security (e.g., password guessing programs, cracking tools or network probing tools) is strictly prohibited;</li>
                        <li>Take any action that imposes an unreasonable or disproportionately large load on our network or infrastructure;</li>
                        <li>Upload or otherwise transmit any communication, software, or material that contains a virus or is otherwise harmful to the computers, devices or systems of the Provider or its users; or</li>
                        <li>Engage in any other conduct that restricts or inhibits any person from using or enjoying the Services, or that, in our sole judgment, exposes us or any of our affiliates, users or any other third party to any liability, damages, or detriment of any type.</li>
                    </ul>
                    You agree that we reserve the right to monitor the use of the Services. Violations of system or network security and certain other conduct may result in civil or criminal liability.  We may investigate and work with law enforcement authorities to prosecute users who violate the TOU.  We may suspend or terminate your access to the Services for any or no reason at any time without notice.
                    </p>

                  <h2>2. Account/Service Termination</h2>
                    <p>
                    You agree and understand that the Provider may terminate your access to the Services without any previous notice and may destroy any data stored with the Provider. If the Provider receives notice alleging that you have engaged in infringing behaviour the Provider or others or applicable laws, The Provider may, at their discretion, suspend Services without notice. The Provider is not liable to you or to any third party for the termination of your account and for the interruption of the Services.
                    </p>

                  <h2>3. User Responsibilities</h2>
                    <p>
                    You are fully responsible and liable for what you copy, share, upload, download and all other activities performed within your account and with the Services. You must not upload spyware or any other malicious software to the Services. The Provider is not liable for any loss or corruption of your data or for any costs or expenses associated with backing up or restoring any of your data entrusted to the Provider.
                    </p>

                <h2>4. Disclaimer of Warranties</h2>
                  <p>
                  YOUR USE OF THE SERVICES IS ENTIRELY AT YOUR OWN RISK.  WE MAKE NO REPRESENTATIONS OR WARRANTIES ABOUT THE SERVICES, INCLUDING WITHOUT LIMITATION THE OPERATION OF THE SERVICES OR THE INFORMATION, MATERIALS,  OR SERVICES APPEARING OR OFFERED ON THE SERVICES OR WITH RESPECT TO ANY WEBSITES OR SERVICES LINKED FROM THE SERVICES.  THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.”  WITHOUT LIMITING THE GENERALITY OF THE FOREGOING, WE DISCLAIM ALL WARRANTIES, EXPRESS, STATUTORY OR IMPLIED, INCLUDING BUT NOT LIMITED TO (I) THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE; (II) THE WARRANTIES AGAINST INFRINGEMENT, MISAPPROPRIATION OR VIOLATION OF ANY INTELLECTUAL PROPERTY OR PROPRIETARY RIGHTS OF ANY PERSON; (III) WARRANTIES ARISING THROUGH COURSE OF DEALING OR USAGE IN TRADE; AND (IV) THE WARRANTIES RELATING TO THE ACCURACY, RELIABILITY, CORRECTNESS, OR COMPLETENESS OF DATA OR CONTENT MADE AVAILABLE ON THE SERVICES OR OTHERWISE BY THE PROVIDER.  FURTHER, THERE IS NO WARRANTY THAT THE SERVICES WILL MEET YOUR NEEDS OR REQUIREMENTS OR THE NEEDS OR REQUIREMENTS OF ANY OTHER PERSON OR THE NEEDS OR REQUIREMENTS SET FORTH IN ANY DOCUMENTATION.  WE MAKE NO WARRANTIES, EXPRESS, STATUTORY OR IMPLIED, THAT THE SERVICES, INCLUDING WITHOUT LIMITATION THE CONTENT, FUNCTIONS OR MATERIALS CONTAINED THEREIN, WILL BE TIMELY, SECURE, ACCURATE, ERROR-FREE, COMPLETE, UP-TO-DATE, FREE OF VIRUSES, OR UNINTERRUPTED.  THE PROVIDER DO NOT NECESSARILY ENDORSE, SUPPORT, SANCTION, ENCOURAGE OR AGREE WITH ANY CONTENT, AND WE EXPRESSLY DISCLAIM ANY AND ALL REPRESENTATIONS, WARRANTIES AND LIABILITIES IN CONNECTION WITH ANY CONTENT.  THE PROVIDER MAKE NO REPRESENTATION THAT THE SERVICES ARE APPROPRIATE OR AVAILABLE FOR USE OUTSIDE THE EUROPEAN UNION.  NO ORAL OR WRITTEN INFORMATION MADE AVAILABLE BY OR ON BEHALF OF THE PROVIDER SHALL CREATE ANY WARRANTY.
                  </br>
                  </br>
                  IF APPLICABLE LAW DOES NOT ALLOW THE EXCLUSION OF SOME OR ALL OF THE ABOVE IMPLIED OR STATUTORY WARRANTIES TO APPLY TO YOU, THE ABOVE EXCLUSIONS WILL APPLY TO YOU TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.
                  </p>

              <h2>5. Exclusive Remedy and Limitation of Liability</h2>
                <p>
                UNDER NO CIRCUMSTANCES, INCLUDING WITHOUT LIMITATION NEGLIGENCE, WILL THE PROVIDER, ITS AFFILIATES, OR ANY PARTY INVOLVED IN CREATING, PRODUCING , OR DELIVERING THE SERVICES BE LIABLE FOR DAMAGES OR LOSSES INCLUDING WITHOUT LIMITATION DIRECT, INCIDENTAL, CONSEQUENTIAL, INDIRECT, SPECIAL, OR PUNITIVE DAMAGES AND LOST PROFITS ARISING OUT OF THE TERMS OR YOUR ACCESS, USE, MISUSE, OR INABILITY TO USE THE SERVICES, INCLUDING WITHOUT LIMITATION ANY PROVIDER’S CONTENT OR USER CONTENT, OR ANY SITES LINKED FROM THE SERVICES, HOWEVER CAUSED, WHETHER IN CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY OR OTHERWISE, EVEN IF THE PROVIDER HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, OR IN CONNECTION WITH ANY FAILURE OF PERFORMANCE, ERROR, OMISSION, INTERRUPTION, DEFECT, DELAY IN OPERATION OR TRANSMISSION, COMPUTER VIRUS, OR LINE OR SYSTEM FAILURE.

                Because some jurisdictions do nodialogt allow the exclusion or limitation of incidental or consequential damages, the Provider’s liability in such jurisdictions shall be limited to the extent permitted by law.  Any claim against us shall be limited to the amount you paid, if any, for use of the Services.
                </p>
            <h2>6. Indemnification</h2>
              <p>
              You agree to indemnify, hold harmless, and defend the Provider and its affiliates, officers, directors, contractors, agents, employees, successors and assigns from and against any and all demands, claims, damages, liabilities, judgments, fines, interest, penalties, losses, costs, expenses and harms, including without limitation reasonable attorneys’ fees and fees of other professional advisers, arising out of or in connection with (i) your use of the Services (including, without limitation, your Content and or by the Provider, and your use of any other user’s Content), (ii) your online conduct, (iii) your violation or breach of this TOU, (iv) your failure to comply with any applicable laws or regulations, (v) your negligence, wilful misconduct, or violations of the intellectual property or other rights of any person, or (vi) any of your dealings or transactions with other persons resulting from use of the Services.  You shall not settle any such claim without the prior written consent of the Provider.  These obligations will survive any termination of these TOU.
              </p>
            <h2>7. Integration and Severability</h2>
              <p>
              These TOU constitute the entire agreement between the Provider  and you, superseding any prior or contemporaneous communications and proposals (whether oral, written or electronic) between you and us.  In the event any provision of this TOU is held unenforceable, it will not affect the validity or enforceability of the remaining provisions and will be replaced by an enforceable provision that comes closest to the intention underlying the unenforceable provision.
              </p>
            <h2>8. No Waiver</h2>
              <p>
              Our failure to enforce any provisions of this TOU or respond to a breach by you or other parties shall not in any way waive our right to enforce subsequently any terms or conditions of the TOU or to act with respect to similar breaches.
              </p>
            <h2>9. Location and Governing Law</h2>
              <p>
              These TOU are governed by, and must be construed in accordance with the laws of Spain and interpreted according to applicable EU law principles, without giving effect to their principles of conflicts of law.  By using the Services, you waive any claims that may arise under the laws of other states, countries, territories or jurisdictions.
              </p>
            <h2>10. Miscellaneous and Contact Information</h2>
              </p>
              No joint venture, partnership, employment, or agency relationship exists between the Provider and the user or as a result of this agreement or the use of our services.
              </br></br>
            Please direct any questions, complaints or claims related to the Services or your use of the Services by email to <a href = "mailto: products@grycap.upv.es">products@grycap.upv.es</a>.
            </p>
          </div>
        </v-card>
      </v-dialog>
      &nbsp; &nbsp; &nbsp;
      <v-dialog id="vdiag" lazy v-model="privacy"  :fullscreen="$vuetify.breakpoint.xs" max-width="70%" >
        <h5 slot="activator" dark class="mb-2"  style="color:#ff9966;font-size:1rem">
          Privacy Policy
        </h5>
          <v-card  >
            <div style="padding:50px">
              <div style="float: right">
              <v-btn  @click="privacy = false"> Close</v-btn>
            </div >

              <h1 >Privacy Policy</h1>

            <table >
             <tr>
               <td>Name of the service</td>
               <td>OSCAR</td>
             </tr>
             <tr>
               <td>URLs of the service</td>
               <td>https://appsgrycap.i3m.upv.es:31443/im-web/
               </td>
             </tr>
             <tr>
               <td>Description of the service</td>
               <td>Infrastructure Manager (IM) is an open-source tool that deploys
               complex and customized virtual infrastructures on multiple Cloud
               back-ends. The IM automates the deployment, configuration, software
               installation, monitoring and update of virtual infrastructures. </td>
             </tr>
             <tr>
               <td>Data controller </td>
               <td>Grupo de Grid y Computación de Altas Prestaciones (GRyCAP) de la
               Universitat Politècnica de València (UPV):
               Universitat Politècnica de València
               Camino de Vera s/n
               Edificio 8B, Acc. N, Nivel 1. GRyCAP
               Valencia, Valencia 46022
               Spain
             </br>
               email: products@grycap.upv.es</td>
             </tr>
             <tr>
               <td>Jurisdiction</td>
               <td>ES.Spain (Valencia)</td>
             </tr>
             <tr>
               <td>Personal data
               processed</td>
               <td>A. Following data is retrieved from your Identity Provider (only in
               case of using EGI-Checking):
               a. User's ID.
               b. Name
               c. Given Name.
               d. Family Name.
               e. VOs affiliation.
               f. User’s email.
               B. Following data is gathered from yourself:
               a. Cloud providers credentials.
               b. User’s email.</td>
             </tr>
             <tr>
               <td>Purpose of the
               processing of
               personal data</td>
               <td>Personal data are used to contact Cloud Providers, on behalf of the
               user, enabling the IM service the creation of the requested virtual
               resources.
               Log files containing personal data are maintained, for traceability
               reasons, for a limited period of time (at least 1 month)</td>
             </tr>
             <tr>
               <td>Third parties to
               whom personal data
               is disclosed</td>
               <td>None</td>
             </tr>
             <tr>
               <td>How to access,
               rectify and delete
               the personal data
             </td>
               <td>Contact the email: products@grycap.upv.es. To rectify the data
               released by your Home Organisation, contact your Home
               Organisation's IT helpdesk</td>
             </tr>
             <tr>
               <td>Data retention</td>
               <td>Personal data is deleted on request of the user</td>
             </tr>
             <tr>
               <td>Data Protection
               Code of Conduct</td>
               <td>Your personal data will be protected according to the
                 <a target="_blank" href="http://www.geant.net/uri/dataprotection-code-of-conduct/v1">Code of Conduct
               for Service Providers</a>, a common standard for the research and higher
               education sector to protect your privacy</td>
             </tr>
             <tr>
               <td>Cookies</td>
               <td>
                  This site uses an internal cookie only to maintain user sessions with the
                 server.
                 Our website uses Google Analytics, For more information about privacy
                 at Google Analytics, please see <a target="_blank" href="https://policies.google.com/privacy">
                   Google’s privacy policy</a>. You can
                 prevent the collection of the data generated by the cookie and
                 transmission to Google by modifying the Cookies Consent.
              </td>
             </tr>
           </table>
         </div>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
  </v-footer>
</div>
</template>
<script>

import env from '@/env'
export default {name: 'foot',
  data () {
    return {
      term: false,
      privacy:false,
    }
  }
};

</script>
<style scoped>
h5{
    font-size:0.9rem !important
}
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}


</style>
