// MainDashboard.jsx
import React, { useState, useContext, useCallback, useEffect, useMemo, useRef } from 'react';
import { GroupContext } from '../../../contexts/GroupNameContext/GroupNameContext';
import { AuthContext } from '../../../contexts/AuthContext';
import StatusModal from "../../../ReusableFolder/SuccessandField";
import { AdminDisplayContext } from '../../../contexts/AdminContext/AdminContext';
import { StudentContext } from '../../../contexts/StudentContext/StudentContext';
import {
  LayoutDashboard, FileText, MessageSquare, Calendar, Upload,
  CheckCircle, Clock, AlertCircle, LogOut, Bell, Search,
  ChevronRight, MoreVertical, Menu, X, BookOpen, GraduationCap,
  Users, UserCheck, ShieldCheck, History, FileUp, Plus, Check,
  RefreshCw, Crown, UserPlus, Edit2, ThumbsUp, Save, Mail
} from 'lucide-react';
// Import all components
import DashboardHeader from './DashboardHeader';
import ProgressCard from './ProgressCard';
import ThesisTitleSection from './ThesisTitleSection';
import AdviserSelectionSection from './AdviserSelectionSection';
import GroupLeaderSelection from './GroupLeaderSelection';
import SelectedLeaderDisplay from './SelectedLeaderDisplay';
import SelectedAdvisersDisplay from './SelectedAdvisersDisplay';
import GroupMembersCard from './GroupMembersCard';
import RegistrationStepsCard from './RegistrationStepsCard';
import CreateGroupModal from './CreateGroupModal';
import MemberApprovalModal from './MemberApprovalModal';
import LeaderConfirmationModal from './LeaderConfirmationModal';
import LoadingSpinner from './LoadingSpinner';

const MainDashboard = () => {
  const { faculty, InsertAdvicerCoAdviser } = useContext(AdminDisplayContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { AddGroup, singleGroup, setSingleGroup, FetchSingleGroup } = useContext(GroupContext);
  const { user, userProfile, linkId, role } = useContext(AuthContext);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { students, myStudent, Studentlead, SelectLead, GetStudentLead, GetMyStudent, myGroup, myGroupThesis } = useContext(StudentContext)
  const [statusModalProps, setStatusModalProps] = useState({
    status: null,
    error: null,
    title: "",
    message: "",
    onRetry: null,
  });
  console.log("myGroupThesis", myGroupThesis)

  // STATE PARA SA LEADER SELECTION (LAMANG PARA SA MEMBER)
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [showLeaderModal, setShowLeaderModal] = useState(false);
  const [isSavingLeader, setIsSavingLeader] = useState(false);

  // PERMANENT/SAVED STATES - galing sa database
  const [savedAdviser, setSavedAdviser] = useState(null);
  const [savedCoAdviser, setSavedCoAdviser] = useState(null);
  const [savedLeader, setSavedLeader] = useState(null);

  console.log("Studentlead", Studentlead)
  console.log("savedLeader", savedLeader)

  // PROCESS ACTUAL STUDENTLEAD DATA FOR LEADERS
  const availableLeaders = useMemo(() => {
    console.log("Processing Studentlead for leaders:", Studentlead);

    if (!Studentlead || !Array.isArray(Studentlead) || Studentlead.length === 0) {
      console.log("No Studentlead data available");
      return [];
    }

    const leaders = Studentlead.filter(student => {
      const isApproved = student.statusAccount === "approved";
      const isStudent = student.role === "student";
      const notSelf = student._id !== userProfile?._id;
      const notAlreadyLeader = !savedLeader || savedLeader._id !== student._id;

      return isApproved && isStudent && notSelf && notAlreadyLeader;
    }).map(student => ({
      id: student._id,
      _id: student._id,
      name: `${student.first_name || ''} ${student.last_name || ''}`.trim() || student.username || student.email,
      firstName: student.first_name || '',
      lastName: student.last_name || '',
      studentId: student.linkedId || student._id,
      course: student.course || "Not specified",
      email: student.username || student.email,
      role: student.role || "student",
      yearLevel: student.yearLevel || 4,
      section: student.section || "N/A",
      gwa: student.gwa || 1.8,
      skills: student.skills || ["Team Player", "Communication"],
      avatar: student.avatar || null,
      isActive: student.statusAccount === "approved",
      previousLeadership: student.previousLeadership || "",
      achievements: student.achievements || [],
      statusAccount: student.statusAccount
    }));

    console.log("Available leaders after processing:", leaders);
    return leaders;
  }, [Studentlead, userProfile, savedLeader]);

  const [tempSelectedAdviser, setTempSelectedAdviser] = useState(null);
  const [tempSelectedCoAdviser, setTempSelectedCoAdviser] = useState(null);

  const [showMemberApprovalModal, setShowMemberApprovalModal] = useState(false);
  const [selectedMemberForApproval, setSelectedMemberForApproval] = useState(null);
  const [isSavingAdvisers, setIsSavingAdvisers] = useState(false);
  const [isLoadingAdvisers, setIsLoadingAdvisers] = useState(true);

  console.log("role", role)

  const renderCount = useRef(0);
  renderCount.current++;

  // State for thesis title management
  const [proposedTitles, setProposedTitles] = useState([
    { id: 1, title: "AI-Powered Learning Management System with Real-time Analytics", status: 'pending' },
    { id: 2, title: "Blockchain-Based Student Records Management System for BIPSU", status: 'pending' },
    { id: 3, title: "Mobile Application for Campus Navigation and Event Management", status: 'approved' },
  ]);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [formInput, setFormInput] = useState({ groupName: '' });

  const [milestones, setMilestones] = useState({
    groupCreated: !!singleGroup?.groupname,
    membersComplete: false,
    membersApproved: false,
    adviserSelected: false,
    coAdviserSelected: false,
    titleApproved: false,
    leaderSelected: false
  });

  const [groupMembers, setGroupMembers] = useState([]);
  const [activeLeaders, setActiveLeaders] = useState([]);

  // ================================================================
  // DEFINE showStatusMessage FIRST before using it in useEffect
  // ================================================================
  const handleCloseStatusModal = useCallback(() => {
    setShowStatusModal(false);
    setTimeout(() => {
      setStatusModalProps({
        status: null,
        error: null,
        title: "",
        message: "",
        onRetry: null,
      });
    }, 300);
  }, []);

  const showStatusMessage = useCallback((status, error = null, customProps = {}) => {
    setStatusModalProps({
      status,
      error,
      title: customProps.title || "",
      message: customProps.message || "",
      onRetry: customProps.onRetry || null,
    });
    setShowStatusModal(true);
  }, []);

  // LOAD SAVED ADVISERS, CO-ADVISERS, AND LEADER - PRIORITIZE myGroup FOR MEMBER ROLE
  useEffect(() => {
    console.log("Loading advisers from myGroup:", myGroup);
    console.log("Loading advisers from myStudent:", myStudent);

    // For member role, data should come from myGroup
    if (role === 'member' && myGroup) {
      // Check for advisers in myGroup.advisers array
      if (myGroup?.advisers && Array.isArray(myGroup.advisers) && myGroup.advisers.length > 0) {
        const adviserData = myGroup.advisers.find(item => item.role === "Adviser");
        const coAdviserData = myGroup.advisers.find(item => item.role === "Co-Adviser");
        const leaderData = myGroup.advisers.find(item => item.role === "Leader");

        if (adviserData?.user) {
          const adviserUser = adviserData.user;
          const adviser = {
            _id: adviserUser._id,
            id: adviserUser._id,
            name: `${adviserUser.first_name || ''} ${adviserUser.last_name || ''}`.trim() || adviserUser.username,
            firstName: adviserUser.first_name,
            lastName: adviserUser.last_name,
            email: adviserUser.username || adviserUser.email,
            role: adviserUser.role,
            department: adviserUser.department,
            isSaved: true
          };
          setSavedAdviser(adviser);
          console.log("Loaded Adviser from myGroup:", adviser);
        }

        if (coAdviserData?.user) {
          const coAdviserUser = coAdviserData.user;
          const coAdviser = {
            _id: coAdviserUser._id,
            id: coAdviserUser._id,
            name: `${coAdviserUser.first_name || ''} ${coAdviserUser.last_name || ''}`.trim() || coAdviserUser.username,
            firstName: coAdviserUser.first_name,
            lastName: coAdviserUser.last_name,
            email: coAdviserUser.username || coAdviserUser.email,
            role: coAdviserUser.role,
            department: coAdviserUser.department,
            isSaved: true
          };
          setSavedCoAdviser(coAdviser);
          console.log("Loaded Co-Adviser from myGroup:", coAdviser);
        }

        if (leaderData?.user) {
          const leaderUser = leaderData.user;
          const leader = {
            _id: leaderUser._id,
            id: leaderUser._id,
            name: `${leaderUser.first_name || ''} ${leaderUser.last_name || ''}`.trim() || leaderUser.username,
            firstName: leaderUser.first_name,
            lastName: leaderUser.last_name,
            email: leaderUser.username || leaderUser.email,
            studentId: leaderUser.linkedId || leaderUser._id,
            course: leaderUser.course || "Not specified",
            role: "Leader",
            isSaved: true,
            yearLevel: leaderUser.yearLevel || 4,
            section: leaderUser.section || "N/A",
            gwa: leaderUser.gwa || 1.8,
            skills: leaderUser.skills || ["Team Player", "Communication"]
          };
          setSavedLeader(leader);
          setMilestones(prev => ({ ...prev, leaderSelected: true }));
          console.log("Loaded Leader from myGroup.advisers:", leader);
        }
      }

      // ✅ FIXED: Check for studentLead in myGroup (alternative location for leader)
      // Only set if fullName is NOT empty or null
      if (myGroup?.studentLead && myGroup.studentLead.fullName && myGroup.studentLead.fullName.trim() !== "") {
        const leaderFromGroup = {
          _id: myGroup.studentLead.id,
          id: myGroup.studentLead.id,
          name: myGroup.studentLead.fullName,
          email: myGroup.studentLead.username || "",
          role: "Leader",
          isSaved: true,
          studentId: myGroup.studentLead.id,
          course: "Not specified",
          firstName: myGroup.studentLead.fullName?.split(' ')[0] || '',
          lastName: myGroup.studentLead.fullName?.split(' ')[1] || '',
          selectedAt: new Date().toISOString()
        };
        setSavedLeader(leaderFromGroup);
        setMilestones(prev => ({ ...prev, leaderSelected: true }));
        console.log("Loaded Leader from myGroup.studentLead:", leaderFromGroup);
      } else if (myGroup?.studentLead && (!myGroup.studentLead.fullName || myGroup.studentLead.fullName.trim() === "")) {
        // ✅ If studentLead exists but fullName is empty, treat as NO LEADER SELECTED
        console.log("studentLead found but fullName is empty - no leader selected");
        setSavedLeader(null);
        setMilestones(prev => ({ ...prev, leaderSelected: false }));
      }

      // Load group name from myGroup.group
      if (myGroup?.group?.name && !milestones.groupCreated) {
        setMilestones(prev => ({ ...prev, groupCreated: true }));
      }
    }

    // Fallback: Check myStudent.AdvicerCoadvicer for non-member roles or backward compatibility
    if (myStudent?.AdvicerCoadvicer && Array.isArray(myStudent.AdvicerCoadvicer) && myStudent.AdvicerCoadvicer.length > 0) {
      const adviserData = myStudent.AdvicerCoadvicer.find(item => item.role === "Adviser");
      const coAdviserData = myStudent.AdvicerCoadvicer.find(item => item.role === "Co-Adviser");
      const leaderData = myStudent.AdvicerCoadvicer.find(item => item.role === "Leader");

      if (adviserData?.user && !savedAdviser) {
        const adviserUser = adviserData.user;
        const adviser = {
          _id: adviserUser._id,
          id: adviserUser._id,
          name: `${adviserUser.first_name || ''} ${adviserUser.last_name || ''}`.trim() || adviserUser.username,
          firstName: adviserUser.first_name,
          lastName: adviserUser.last_name,
          email: adviserUser.username || adviserUser.email,
          role: adviserUser.role,
          department: adviserUser.department,
          isSaved: true
        };
        setSavedAdviser(adviser);
        console.log("Loaded Adviser from myStudent:", adviser);
      }

      if (coAdviserData?.user && !savedCoAdviser) {
        const coAdviserUser = coAdviserData.user;
        const coAdviser = {
          _id: coAdviserUser._id,
          id: coAdviserUser._id,
          name: `${coAdviserUser.first_name || ''} ${coAdviserUser.last_name || ''}`.trim() || coAdviserUser.username,
          firstName: coAdviserUser.first_name,
          lastName: coAdviserUser.last_name,
          email: coAdviserUser.username || coAdviserUser.email,
          role: coAdviserUser.role,
          department: coAdviserUser.department,
          isSaved: true
        };
        setSavedCoAdviser(coAdviser);
        console.log("Loaded Co-Adviser from myStudent:", coAdviser);
      }

      if (leaderData?.user && !savedLeader) {
        const leaderUser = leaderData.user;
        const leader = {
          _id: leaderUser._id,
          id: leaderUser._id,
          name: `${leaderUser.first_name || ''} ${leaderUser.last_name || ''}`.trim() || leaderUser.username,
          firstName: leaderUser.first_name,
          lastName: leaderUser.last_name,
          email: leaderUser.username || leaderUser.email,
          studentId: leaderUser.studentId || leaderUser.linkedId,
          course: leaderUser.course,
          role: "Leader",
          isSaved: true,
          yearLevel: leaderUser.yearLevel || 4,
          section: leaderUser.section || "N/A",
          gwa: leaderUser.gwa || 1.8,
          skills: leaderUser.skills || ["Team Player"]
        };
        setSavedLeader(leader);
        setMilestones(prev => ({ ...prev, leaderSelected: true }));
        console.log("Loaded Leader from myStudent:", leader);
      }
    }

    const timer = setTimeout(() => {
      setIsLoadingAdvisers(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [myGroup, myStudent, userProfile, role]);

  // ================================================================
  // AUTO-COMPLETE REGISTRATION STEP WHEN TITLE IS APPROVED
  // ================================================================
  useEffect(() => {
    // Check if there's any approved title in the proposedTitles array
    const hasApprovedTitle = proposedTitles.some(title => title.status === 'approved');

    console.log("🔍 Checking title approval status:", {
      hasApprovedTitle,
      currentTitleApproved: milestones.titleApproved,
      proposedTitles
    });

    // If there's an approved title and it's not yet marked in milestones
    if (hasApprovedTitle && !milestones.titleApproved) {
      console.log("✅ Title approved detected! Updating milestone and progress bar...");

      // Update the milestone to mark title as approved
      setMilestones(prev => ({
        ...prev,
        titleApproved: true
      }));

      // Optional: Show a subtle success notification
      // Uncomment if you want a toast notification
      /*
      showStatusMessage("success", null, {
        title: "Thesis Title Approved! 🎉",
        message: "Your thesis title has been approved. Registration step is now complete!"
      });
      */
    }

    // If no approved title exists but milestone says it's approved, reset it
    if (!hasApprovedTitle && milestones.titleApproved) {
      console.log("⚠️ No approved title found, resetting titleApproved milestone");
      setMilestones(prev => ({
        ...prev,
        titleApproved: false
      }));
    }
  }, [proposedTitles, milestones.titleApproved]); // Removed showStatusMessage from dependencies since it's commented out

  // Also check for approved title when myGroupThesis loads (in case titles come from API)
  useEffect(() => {
    // If myGroupThesis has thesis data with approved status
    if (myGroupThesis && myGroupThesis.thesisTitle) {
      const thesisStatus = myGroupThesis.status || myGroupThesis.thesisStatus;
      if (thesisStatus === 'approved' && !milestones.titleApproved) {
        console.log("✅ Approved thesis found in myGroupThesis data!");
        setMilestones(prev => ({
          ...prev,
          titleApproved: true
        }));
      }
    }
  }, [myGroupThesis, milestones.titleApproved]);

  const handleSelectLeader = useCallback((leader) => {
    if (savedLeader) {
      showStatusMessage("error", null, {
        title: "Leader Already Assigned",
        message: `Your group already has a leader: ${savedLeader.name}. Contact your administrator to change the leader.`
      });
      return;
    }

    setSelectedLeader(leader);
    setShowLeaderModal(true);
  }, [savedLeader, showStatusMessage]);

  const confirmLeaderSelection = useCallback(async () => {
    if (!selectedLeader) return;

    setIsSavingLeader(true);

    try {
      // Gamitin ang SelectLead function mula sa context
      const myStudentId = myStudent?._id || userProfile?.linkedId || linkId;

      if (!myStudentId) {
        showStatusMessage("error", null, {
          title: "Error",
          message: "Cannot find your student ID. Please refresh the page."
        });
        return;
      }

      const result = await SelectLead(myStudentId, selectedLeader._id);

      if (result?.success) {
        // DIREKTANG I-SET ANG SAVED LEADER GAMIT ANG SELECTED LEADER DATA
        const newLeader = {
          _id: selectedLeader._id,
          id: selectedLeader._id,
          name: selectedLeader.name,
          firstName: selectedLeader.firstName,
          lastName: selectedLeader.lastName,
          email: selectedLeader.email,
          studentId: selectedLeader.studentId,
          course: selectedLeader.course,
          role: "Leader",
          isSaved: true,
          yearLevel: selectedLeader.yearLevel || 4,
          section: selectedLeader.section || "N/A",
          gwa: selectedLeader.gwa || 1.8,
          skills: selectedLeader.skills || ["Team Player"],
          selectedAt: new Date().toISOString()
        };

        // I-set agad ang savedLeader para mag-render agad ang UI
        setSavedLeader(newLeader);
        setMilestones(prev => ({ ...prev, leaderSelected: true }));

        // I-refresh ang data sa background
        if (typeof GetStudentLead === 'function') {
          GetStudentLead();
        }
        if (typeof GetMyStudent === 'function') {
          GetMyStudent();
        }

        showStatusMessage("success", null, {
          title: "Leader Selected! 👑",
          message: `${selectedLeader.name} has been successfully selected as your group leader.`
        });

        setShowLeaderModal(false);
        setSelectedLeader(null);
      } else {
        showStatusMessage("error", null, {
          title: "Selection Failed",
          message: result?.error || "Failed to set group leader. Please try again."
        });
      }
    } catch (error) {
      console.error("Error saving leader:", error);
      showStatusMessage("error", null, {
        title: "Selection Failed",
        message: error.message || "Failed to set group leader. Please try again."
      });
    } finally {
      setIsSavingLeader(false);
    }
  }, [selectedLeader, SelectLead, myStudent, userProfile, linkId, showStatusMessage, GetStudentLead, GetMyStudent]);

  const availableAdvisers = useMemo(() => {
    if (!faculty || faculty.length === 0) {
      return [];
    }

    const advisers = faculty.filter(f =>
      f.role === 'adviser' || f.role === 'panelist' || f.role === 'Adviser'
    );

    return advisers.map((f) => ({
      _id: f._id,
      id: f._id,
      name: `${f.first_name || ''} ${f.last_name || ''}`.trim() || f.email,
      firstName: f.first_name,
      lastName: f.last_name,
      email: f.email,
      department: f.department,
      contact_number: f.contact_number,
      specialty: f.specialty,
      role: f.role,
      slots: f.currentSlots || 0,
      maxSlots: f.maxSlots || 5,
      statusAccount: f.statusAccount,
      avatar: f.avatar || {}
    }));
  }, [faculty]);

  const progress = useMemo(() => {
    let allStepsComplete = false;

    if (role === 'member') {
      allStepsComplete = milestones.groupCreated &&
        milestones.membersComplete &&
        milestones.membersApproved &&
        milestones.leaderSelected &&
        milestones.titleApproved;
    } else {
      allStepsComplete = milestones.groupCreated &&
        milestones.membersComplete &&
        milestones.membersApproved &&
        milestones.adviserSelected &&
        milestones.coAdviserSelected &&
        milestones.titleApproved;
    }

    if (allStepsComplete) return 100;

    let progressValue = 0;
    if (milestones.groupCreated) progressValue += 10;
    if (milestones.membersComplete) progressValue += 10;
    if (milestones.membersApproved) progressValue += 10;

    if (role === 'member') {
      if (milestones.leaderSelected) progressValue += 15;
      if (milestones.titleApproved) progressValue += 30;
    } else {
      if (milestones.adviserSelected) progressValue += 20;
      if (milestones.coAdviserSelected) progressValue += 20;
      if (milestones.titleApproved) progressValue += 15;
    }

    return Math.min(progressValue, 95);
  }, [milestones, role]);

  const studentData = useMemo(() => ({
    name: userProfile?.name || "",
    studentId: userProfile?.studentId || "",
    course: userProfile?.course || "",
    groupName: role === 'student'
      ? (myGroupThesis?.group?.name || singleGroup?.groupname || "No Group Joined")
      : (myGroup?.group?.name || singleGroup?.groupname || "No Group Joined"),
    thesisTitle: userProfile?.thesisTitle || (proposedTitles.find(t => t.status === 'approved')?.title || "TBD"),
    groupLeader: savedLeader?.name || (role === 'member' ? "No Leader Selected" : "N/A"),
    adviser: savedAdviser?.name || "TBA",
    coAdviser: savedCoAdviser?.name || "TBA",
    progress: progress,
    status: (() => {
      let allComplete = false;

      if (role === 'member') {
        allComplete = milestones.groupCreated && milestones.membersComplete && milestones.membersApproved &&
          milestones.leaderSelected && milestones.titleApproved;
      } else {
        allComplete = milestones.groupCreated && milestones.membersComplete && milestones.membersApproved &&
          milestones.adviserSelected && milestones.coAdviserSelected && milestones.titleApproved;
      }

      if (allComplete) return "✓ REGISTRATION COMPLETE! ✓";
      if (progress >= 80) return "Almost Complete!";
      if (progress >= 60) return "Members Approved - Proceeding to Adviser";
      if (progress >= 40) return "In Progress";
      if (progress >= 15) return "Group Formed";
      return "Incomplete";
    })()
  }), [userProfile, myGroup, myGroupThesis, singleGroup, savedLeader, savedAdviser, savedCoAdviser, progress, milestones, proposedTitles, role]);

  useEffect(() => {
    setMilestones(prev => ({
      ...prev,
      adviserSelected: !!savedAdviser,
      coAdviserSelected: !!savedCoAdviser,
      leaderSelected: !!savedLeader
    }));
  }, [savedAdviser, savedCoAdviser, savedLeader]);

  useEffect(() => {
    if (groupMembers.length === 0) {
      setMilestones(prev => ({ ...prev, membersApproved: false, membersComplete: false }));
      return;
    }

    const allMembersApproved = groupMembers.every(member => member.status === 'approved');
    setMilestones(prev => ({
      ...prev,
      membersApproved: allMembersApproved,
      membersComplete: groupMembers.length >= 1
    }));
  }, [groupMembers]);

  // SET GROUP MEMBERS - USE myGroupThesis ONLY FOR STUDENT ROLE, member role stays with myGroup
  useEffect(() => {
    // For member role, use myGroup data (DEFAULT LOGIC - HINDI BINAGO)
    if (role === 'member' && myGroup) {
      if (myGroup.group?.name) {
        setMilestones(prev => ({ ...prev, groupCreated: true }));
      }

      // Extract members from myGroup if available
      if (myGroup.members && Array.isArray(myGroup.members)) {
        setGroupMembers(myGroup.members);
      } else if (myGroup.student) {
        // If only the current student is in the group
        setGroupMembers([{
          id: myGroup.student.id || myGroup.student._id,
          name: myGroup.student.fullName,
          role: "Member",
          studentId: myGroup.studentID,
          email: myGroup.student.username,
          status: "approved"
        }]);
      }
    }
    // For student role, use myGroupThesis data (ITO ANG BAGONG IDINAGDAG)
    else if (role === 'student' && myGroupThesis) {
      // Check if myGroupThesis has group name
      if (myGroupThesis.group?.name) {
        setMilestones(prev => ({ ...prev, groupCreated: true }));
      }

      // Extract members from myGroupThesis (array of members)
      if (Array.isArray(myGroupThesis) && myGroupThesis.length > 0) {
        const members = myGroupThesis.map(member => {
          // Get member name from nested structure
          let memberName = "";
          let memberId = "";
          let memberEmail = "";
          let memberStudentId = "";

          if (member.user?.account) {
            memberName = member.user.account.fullName || "Unknown Member";
            memberId = member.user.account.id || member._id;
            memberEmail = member.user.account.username || "";
            memberStudentId = member.user.account.studentID || "";
          } else if (member.user) {
            memberName = member.user.fullName || member.user.username || "Unknown Member";
            memberId = member.user._id || member._id;
            memberEmail = member.user.username || "";
            memberStudentId = member.user.studentID || "";
          } else {
            memberName = member.fullName || member.name || "Unknown Member";
            memberId = member._id;
            memberEmail = member.username || "";
            memberStudentId = member.studentID || "";
          }

          return {
            id: memberId,
            name: memberName,
            role: "Member",
            studentId: memberStudentId,
            email: memberEmail,
            status: "approved"
          };
        });

        setGroupMembers(members);
        setMilestones(prev => ({
          ...prev,
          membersComplete: members.length > 0,
          membersApproved: true
        }));
      }
      else if (myGroupThesis.members && Array.isArray(myGroupThesis.members)) {
        setGroupMembers(myGroupThesis.members);
        setMilestones(prev => ({
          ...prev,
          membersComplete: myGroupThesis.members.length > 0,
          membersApproved: true
        }));
      }
      else if (myGroupThesis.student) {
        setGroupMembers([{
          id: myGroupThesis.student.id || myGroupThesis.student._id,
          name: myGroupThesis.student.fullName || myGroupThesis.student.name,
          role: "Member",
          studentId: myGroupThesis.studentID,
          email: myGroupThesis.student.username,
          status: "approved"
        }]);
        setMilestones(prev => ({
          ...prev,
          membersComplete: true,
          membersApproved: true
        }));
      }
    }
    // For non-student, non-member roles, use singleGroup
    else if (singleGroup && singleGroup.groupname) {
      setMilestones(prev => ({ ...prev, groupCreated: true }));

      if (singleGroup.members) {
        setGroupMembers(singleGroup.members);
      } else if (singleGroup.studentID && userProfile?.name && groupMembers.length === 0) {
        setGroupMembers([{
          id: singleGroup._id,
          name: userProfile.name,
          role: "Member",
          studentId: singleGroup.studentID,
          email: userProfile.email || "",
          gender: singleGroup.gender || "Not specified",
          status: "approved"
        }]);
      }
    } else {
      setGroupMembers([]);
      setMilestones(prev => ({
        ...prev,
        groupCreated: false,
        membersApproved: false
      }));
    }
  }, [singleGroup, userProfile, myGroup, myGroupThesis, role]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchActiveLeaders = async () => {
      try {
        const response = await fetch('/api/active-leaders', { signal: abortController.signal });
        if (response.ok && isMounted) {
          const data = await response.json();
          setActiveLeaders(data);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          console.error("Error fetching active leaders:", error);
        }
      }
    };

    fetchActiveLeaders();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  const getFacultyColor = useCallback((name) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'];
    const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  }, []);

  const getFacultyAvatar = useCallback((firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return 'F';
  }, []);

  const getFacultyAvatarColor = useCallback((name) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-700',
      'bg-gradient-to-br from-green-500 to-green-700',
      'bg-gradient-to-br from-purple-500 to-purple-700',
      'bg-gradient-to-br from-pink-500 to-pink-700',
      'bg-gradient-to-br from-indigo-500 to-indigo-700',
      'bg-gradient-to-br from-teal-500 to-teal-700'
    ];
    const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  }, []);

  const getFacultyInitials = useCallback((firstName, lastName) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) return firstName.charAt(0).toUpperCase();
    if (lastName) return lastName.charAt(0).toUpperCase();
    return '👨‍🏫';
  }, []);

  const getLeaderColor = useCallback((name) => {
    const colors = ['bg-amber-500', 'bg-orange-500', 'bg-yellow-600', 'bg-gold-500', 'bg-amber-600'];
    const hash = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  }, []);

  const handleTempSelectAdviser = useCallback((adviser) => {
    if (tempSelectedCoAdviser?._id === adviser._id) {
      showStatusMessage("error", null, {
        title: "Selection Error",
        message: "This person is already selected as Co-Adviser."
      });
      return;
    }
    if (savedAdviser?._id === adviser._id) {
      showStatusMessage("error", null, {
        title: "Already Assigned",
        message: "This person is already assigned as your Adviser."
      });
      return;
    }
    setTempSelectedAdviser(adviser);
  }, [tempSelectedCoAdviser, savedAdviser, showStatusMessage]);

  const handleTempSelectCoAdviser = useCallback((adviser) => {
    if (tempSelectedAdviser?._id === adviser._id) {
      showStatusMessage("error", null, {
        title: "Selection Error",
        message: "This person is already selected as Adviser."
      });
      return;
    }
    if (savedCoAdviser?._id === adviser._id) {
      showStatusMessage("error", null, {
        title: "Already Assigned",
        message: "This person is already assigned as your Co-Adviser."
      });
      return;
    }
    setTempSelectedCoAdviser(adviser);
  }, [tempSelectedAdviser, savedCoAdviser, showStatusMessage]);

  const handleSaveBothAdvisers = useCallback(async () => {
    if (!tempSelectedAdviser || !tempSelectedCoAdviser) {
      showStatusMessage("error", null, {
        title: "Incomplete Selection",
        message: "Please select both Adviser and Co-Adviser before saving."
      });
      return;
    }

    const studentId = linkId || userProfile?.linkedId || myStudent?._id;

    if (!studentId) {
      showStatusMessage("error", null, {
        title: "No Student ID Found",
        message: "Please complete your profile first or refresh the page."
      });
      return;
    }

    setIsSavingAdvisers(true);

    try {
      const payload = {
        adviser: {
          id: tempSelectedAdviser._id,
          name: tempSelectedAdviser.name,
          role: "Adviser",
          email: tempSelectedAdviser.email,
          department: tempSelectedAdviser.department
        },
        coAdviser: {
          id: tempSelectedCoAdviser._id,
          name: tempSelectedCoAdviser.name,
          role: "Co-Adviser",
          email: tempSelectedCoAdviser.email,
          department: tempSelectedCoAdviser.department
        }
      };

      const result = await InsertAdvicerCoAdviser(studentId, payload);

      if (result?.success) {
        setSavedAdviser({ ...tempSelectedAdviser, isSaved: true });
        setSavedCoAdviser({ ...tempSelectedCoAdviser, isSaved: true });
        setTempSelectedAdviser(null);
        setTempSelectedCoAdviser(null);

        showStatusMessage("success", null, {
          title: "Success!",
          message: `Adviser (${tempSelectedAdviser.name}) and Co-Adviser (${tempSelectedCoAdviser.name}) have been successfully assigned to your group.`
        });
      } else {
        showStatusMessage("error", null, {
          title: "Save Failed",
          message: result?.error || "Failed to save adviser assignments."
        });
      }
    } catch (error) {
      console.error("Error saving advisers:", error);
      showStatusMessage("error", null, {
        title: "Error",
        message: error.message || "An error occurred while saving adviser assignments."
      });
    } finally {
      setIsSavingAdvisers(false);
    }
  }, [tempSelectedAdviser, tempSelectedCoAdviser, linkId, userProfile, myStudent, InsertAdvicerCoAdviser, showStatusMessage]);

  const handleResetTempSelection = useCallback(() => {
    setTempSelectedAdviser(null);
    setTempSelectedCoAdviser(null);
  }, []);

  const handleApproveMember = useCallback((member) => {
    setSelectedMemberForApproval(member);
    setShowMemberApprovalModal(true);
  }, []);

  const confirmApproveMember = useCallback(() => {
    if (!selectedMemberForApproval) return;

    setGroupMembers(prev => prev.map(member =>
      member.id === selectedMemberForApproval.id
        ? { ...member, status: 'approved', approvedBy: userProfile?.name, approvedAt: new Date() }
        : member
    ));

    showStatusMessage("success", null, {
      title: "Member Approved! ✅",
      message: `${selectedMemberForApproval.name} has been approved to join your group.`
    });

    setShowMemberApprovalModal(false);
    setSelectedMemberForApproval(null);
  }, [selectedMemberForApproval, userProfile?.name, showStatusMessage]);

  const handleRejectMember = useCallback((member) => {
    setGroupMembers(prev => prev.filter(m => m.id !== member.id));
    showStatusMessage("error", null, {
      title: "Member Rejected",
      message: `${member.name} has been rejected from joining the group.`
    });
  }, [showStatusMessage]);

  const handleAddCustomTitle = useCallback(() => {
    if (!customTitle.trim()) {
      showStatusMessage("error", null, {
        title: "Empty Title",
        message: "Please enter a thesis title."
      });
      return;
    }

    const newTitle = {
      id: proposedTitles.length + 1,
      title: customTitle,
      status: 'pending',
    };

    setProposedTitles(prev => [...prev, newTitle]);
    setCustomTitle("");
    setIsEditingTitle(false);

    showStatusMessage("success", null, {
      title: "Title Added",
      message: "Your proposed title has been added. Wait for approval from your adviser and co-adviser."
    });
  }, [customTitle, proposedTitles.length, showStatusMessage]);

  // Function to approve a title (call this from child components or when receiving API response)
  const handleApproveTitle = useCallback((titleId) => {
    setProposedTitles(prev => prev.map(title =>
      title.id === titleId
        ? { ...title, status: 'approved' }
        : title
    ));

    // The useEffect will automatically detect this change and update milestones
    console.log(`Title ${titleId} approved - useEffect will handle milestone update`);
  }, []);

  const handleGroupSubmit = useCallback(async (e) => {
    e.preventDefault();

    const groupData = {
      name: userProfile?.name || studentData.name,
      studentId: userProfile?.studentId || studentData.studentId,
      course: userProfile?.course || studentData.course,
      groupName: formInput.groupName,
      thesisTitle: studentData.thesisTitle,
      groupLeader: studentData.groupLeader,
      adviser: studentData.adviser,
      coAdviser: studentData.coAdviser,
      progress: 10,
      status: "Group Formed"
    };

    const result = await AddGroup(groupData);

    if (result?.success) {
      setMilestones(prev => ({ ...prev, groupCreated: true }));
      FetchSingleGroup();
      setIsModalOpen(false);
      showStatusMessage("success", null, { title: "Group Created", message: "Group created successfully." });
    } else {
      showStatusMessage("error", null, { title: "Update Failed", message: result?.message || "Failed to create group" });
    }
  }, [userProfile, studentData, formInput.groupName, AddGroup, showStatusMessage]);

  const getRemainingSteps = useCallback(() => {
    const steps = [];
    if (!milestones.membersComplete) steps.push("Add group members");
    if (!milestones.membersApproved && groupMembers.length > 0) steps.push("Leader approves members");

    if (role === 'member') {
      if (!milestones.leaderSelected) steps.push("Select Group Leader");
    } else {
      if (!milestones.adviserSelected) steps.push("Select Adviser");
      if (!milestones.coAdviserSelected) steps.push("Select Co-Adviser");
    }

    if (!milestones.titleApproved) steps.push("Thesis Title Approval");
    return steps;
  }, [milestones, groupMembers.length, role]);

  const allStepsComplete = useMemo(() => {
    const baseComplete = milestones.groupCreated && milestones.membersComplete &&
      milestones.membersApproved && milestones.titleApproved;

    if (role === 'member') {
      return baseComplete && milestones.leaderSelected;
    }

    return baseComplete && milestones.adviserSelected && milestones.coAdviserSelected;
  }, [milestones, role]);

  const bipsuGlass = "backdrop-blur-xl bg-white/60 border border-white/40 shadow-[0_20px_50px_rgba(0,56,168,0.05)]";
  const floatingClass = "backdrop-blur-2xl bg-white/70 border border-white shadow-[0_30px_60px_-15px_rgba(0,56,168,0.2)] transition-all duration-500";

  return (
    <div className="min-h-screen relative overflow-hidden font-sans text-slate-900 p-3 md:p-6 ">
      {isLoadingAdvisers && <LoadingSpinner />}

      <div className="fixed -top-24 -right-24 w-[500px] h-[500px] bg-[#0038A8]/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <main className="relative z-10 max-w-7xl mx-auto">
        <DashboardHeader
          studentData={studentData}
          role={role}
        />

        {/* ================================================================ */}
        {/* GROUP LEADER SELECTION SECTION - ONLY FOR MEMBER ROLE (NO LEADER YET) */}
        {/* ================================================================ */}
        {role === 'member' && !savedLeader && (
          <GroupLeaderSelection
            availableLeaders={availableLeaders}
            Studentlead={Studentlead}
            handleSelectLeader={handleSelectLeader}
            getLeaderColor={getLeaderColor}
            bipsuGlass={bipsuGlass}
          />
        )}

        {/* ================================================================ */}
        {/* DISPLAY SELECTED LEADER SECTION - When leader is already saved */}
        {/* ================================================================ */}
        {role === 'member' && savedLeader && (
          <SelectedLeaderDisplay
            savedLeader={savedLeader}
            getLeaderColor={getLeaderColor}
            bipsuGlass={bipsuGlass}
          />
        )}

        {/* ADVISER AND CO-ADVISER DISPLAY SECTION - FOR MEMBER ROLE */}
        {role === 'member' && (savedAdviser || savedCoAdviser) && (
          <SelectedAdvisersDisplay
            savedAdviser={savedAdviser}
            savedCoAdviser={savedCoAdviser}
            getFacultyAvatarColor={getFacultyAvatarColor}
            getFacultyInitials={getFacultyInitials}
            bipsuGlass={bipsuGlass}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* MAIN TRACKING CARD */}
            <ProgressCard
              studentData={studentData}
              progress={progress}
              milestones={milestones}
              savedLeader={savedLeader}
              role={role}
              savedAdviser={savedAdviser}
              savedCoAdviser={savedCoAdviser}
              groupMembers={groupMembers}
              allStepsComplete={allStepsComplete}
              getRemainingSteps={getRemainingSteps}
              bipsuGlass={bipsuGlass}
            />

            {/* THESIS TITLE SECTION */}
            <ThesisTitleSection
              proposedTitles={proposedTitles}
              milestones={milestones}
              isEditingTitle={isEditingTitle}
              customTitle={customTitle}
              setCustomTitle={setCustomTitle}
              setIsEditingTitle={setIsEditingTitle}
              handleAddCustomTitle={handleAddCustomTitle}
              onApproveTitle={handleApproveTitle}
              bipsuGlass={bipsuGlass}
            />

            {/* ADVISER CANDIDATES SECTION - NOT FOR MEMBER ROLE */}
            {role !== 'member' && (
              <AdviserSelectionSection
                availableAdvisers={availableAdvisers}
                savedAdviser={savedAdviser}
                savedCoAdviser={savedCoAdviser}
                tempSelectedAdviser={tempSelectedAdviser}
                tempSelectedCoAdviser={tempSelectedCoAdviser}
                isSavingAdvisers={isSavingAdvisers}
                handleTempSelectAdviser={handleTempSelectAdviser}
                handleTempSelectCoAdviser={handleTempSelectCoAdviser}
                handleSaveBothAdvisers={handleSaveBothAdvisers}
                handleResetTempSelection={handleResetTempSelection}
                getFacultyColor={getFacultyColor}
                getFacultyAvatar={getFacultyAvatar}
                bipsuGlass={bipsuGlass}
              />
            )}
          </div>

          {/* SIDEBAR AREA */}
          <div className="lg:col-span-4 space-y-6">
            <GroupMembersCard
              groupMembers={groupMembers}
              savedLeader={savedLeader}
              milestones={milestones}
              role={role}
              handleApproveMember={handleApproveMember}
              handleRejectMember={handleRejectMember}
              floatingClass={floatingClass}
            />

            <RegistrationStepsCard
              milestones={milestones}
              savedLeader={savedLeader}
              savedAdviser={savedAdviser}
              savedCoAdviser={savedCoAdviser}
              role={role}
              allStepsComplete={allStepsComplete}
              floatingClass={floatingClass}
            />
          </div>
        </div>
      </main>

      {/* FAB button - Only show for non-members (members cannot create groups) */}
      {role !== 'member' && (
        <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 h-16 w-16 bg-[#0038A8] hover:bg-blue-700 text-[#FFD700] rounded-full shadow-2xl flex items-center justify-center transition-all z-50">
          <Plus size={32} strokeWidth={3} />
        </button>
      )}

      <CreateGroupModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        formInput={formInput}
        setFormInput={setFormInput}
        handleGroupSubmit={handleGroupSubmit}
        floatingClass={floatingClass}
      />

      <MemberApprovalModal
        showMemberApprovalModal={showMemberApprovalModal}
        setShowMemberApprovalModal={setShowMemberApprovalModal}
        selectedMemberForApproval={selectedMemberForApproval}
        confirmApproveMember={confirmApproveMember}
        floatingClass={floatingClass}
      />

      <LeaderConfirmationModal
        showLeaderModal={showLeaderModal}
        setShowLeaderModal={setShowLeaderModal}
        selectedLeader={selectedLeader}
        isSavingLeader={isSavingLeader}
        confirmLeaderSelection={confirmLeaderSelection}
        floatingClass={floatingClass}
      />

      <StatusModal
        isOpen={showStatusModal}
        onClose={handleCloseStatusModal}
        status={statusModalProps.status}
        error={statusModalProps.error}
        title={statusModalProps.title}
        message={statusModalProps.message}
        onRetry={statusModalProps.onRetry}
        autoClose={true}
        autoCloseTime={3000}
      />
    </div>
  );
};

export default MainDashboard;