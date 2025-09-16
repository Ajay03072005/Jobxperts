

// Wait until DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const addTeacherBtn = document.getElementById("addTeacherBtn");
    const addTeacherModal = document.getElementById("addTeacherModal");
    const cancelAddTeacher = document.getElementById("cancelAddTeacher");
    const modalClose = addTeacherModal.querySelector(".modal-close");
    const addTeacherForm = document.getElementById("addTeacherForm");
    const viewAllTeachersBtn = document.getElementById("viewAllTeachersBtn");
    const roleButtons = document.querySelectorAll(".role-btn");
  
    // ================
    // Modal Handling
    // ================
    const openModal = () => {
      addTeacherModal.classList.add("show");
      document.body.style.overflow = "hidden"; // prevent background scroll
    };
  
    const closeModal = () => {
      addTeacherModal.classList.remove("show");
      document.body.style.overflow = "";
    };
  
    addTeacherBtn?.addEventListener("click", openModal);
    cancelAddTeacher?.addEventListener("click", closeModal);
    modalClose?.addEventListener("click", closeModal);
  
    // Close modal when clicking outside content
    addTeacherModal?.addEventListener("click", (e) => {
      if (e.target === addTeacherModal) {
        closeModal();
      }
    });
  
    // ================
    // Form Handling
    // ================
    addTeacherForm?.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const formData = new FormData(addTeacherForm);
      const teacher = {
        name: formData.get("name"),
        email: formData.get("email"),
        department: formData.get("department"),
      };
  
      console.log("✅ New teacher added:", teacher);
  
      // You could push this to your backend here via fetch()
      // Example:
      // fetch('/api/teachers', { method: 'POST', body: JSON.stringify(teacher), headers: { 'Content-Type': 'application/json' } })
  
      alert(`Teacher ${teacher.name} added successfully!`);
      addTeacherForm.reset();
      closeModal();
    });
  
    // ================
    // Navigation & Role Switching
    // ================
    roleButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        roleButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
  
        const role = btn.dataset.role;
        console.log(`🔄 Switched to role: ${role}`);
  
        // Future: Navigate or load role-specific content here
      });
    });
  
    // ================
    // Teachers Table: Actions
    // ================
    document.querySelectorAll(".teachers-table .action-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        const teacherRow = e.target.closest("tr");
        const teacherName = teacherRow.querySelector(".teacher-name").textContent;
  
        if (action === "view") {
          alert(`👀 Viewing profile of ${teacherName}`);
        } else if (action === "edit") {
          alert(`✏️ Editing profile of ${teacherName}`);
        }
      });
    });
  
    // ================
    // View All Teachers
    // ================
    viewAllTeachersBtn?.addEventListener("click", () => {
      alert("📋 Redirecting to full teachers list...");
      // window.location.href = "/teachers.html"; // Example redirect
    });
  });
  
