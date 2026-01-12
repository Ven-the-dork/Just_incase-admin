// src/pages/user/profile/UserProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";

import ProfileHeaderCard from "../components/ProfileHeaderCard";
import ProfileForm from "../components/ProfileForm";
import LoadingScreen from "../components/LoadingScreen";
import SuccessToast from "../../leave_management/components/SuccessToast";
import ErrorToast from "../../leave_management/components/ErrorToast";

export default function UserProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
    contact: "",
    address: "",
    profileImageUrl: "",
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    const user = JSON.parse(stored);

    setProfile((prev) => ({
      ...prev,
      name: user.fullName || prev.name,
      email: user.email || prev.email,
      position: user.position || prev.position,
      department: user.department || prev.department,
      profileImageUrl: user.profileImageUrl || prev.profileImageUrl,
    }));

    const fetchProfile = async () => {
      try {
        if (!user.employeeId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("employees")
          .select("contact, address, profile_image_url")
          .eq("id", user.employeeId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile((prev) => ({
            ...prev,
            contact: data.contact || "",
            address: data.address || "",
            profileImageUrl: data.profile_image_url || prev.profileImageUrl,
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setErrorMessage("Failed to load profile.");
        setShowErrorToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file (JPG, PNG, GIF, etc.).");
      setShowErrorToast(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image must be smaller than 5MB.");
      setShowErrorToast(true);
      return;
    }

    const stored = sessionStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    const user = JSON.parse(stored);
    if (!user.employeeId) {
      setErrorMessage("Employee ID not found.");
      setShowErrorToast(true);
      return;
    }

    try {
      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.employeeId}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error("Upload failed: " + uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from("employees")
        .update({ profile_image_url: publicUrl })
        .eq("id", user.employeeId);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw new Error("Database update failed: " + updateError.message);
      }

      setProfile((prev) => ({
        ...prev,
        profileImageUrl: publicUrl,
      }));

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileImageUrl: publicUrl,
        })
      );

      setSuccessMessage("Profile picture updated successfully!");
      setShowSuccessToast(true);
    } catch (err) {
      console.error("Error uploading avatar:", err);
      setErrorMessage("Failed to upload profile picture: " + err.message);
      setShowErrorToast(true);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const stored = sessionStorage.getItem("user");
    if (!stored) {
      navigate("/");
      return;
    }
    const user = JSON.parse(stored);

    try {
      const { error } = await supabase
        .from("employees")
        .update({
          full_name: profile.name,
          position: profile.position,
          department: profile.department,
          contact: profile.contact,
          address: profile.address,
        })
        .eq("id", user.employeeId);

      if (error) throw error;

      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          fullName: profile.name,
          position: profile.position,
          department: profile.department,
        })
      );

      setSuccessMessage("Profile updated successfully!");
      setShowSuccessToast(true);
      navigate("/dashboard_user");
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMessage("Failed to update profile: " + err.message);
      setShowErrorToast(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <ProfileHeaderCard
          profileImageUrl={profile.profileImageUrl}
          name={profile.name}
          position={profile.position}
          department={profile.department}
          uploading={uploading}
          onBack={() => navigate("/dashboard_user")}
          onFileChange={handleFileChange}
        />

        <ProfileForm
          profile={profile}
          saving={saving}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/dashboard_user")}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © 2025 CVSU. All rights reserved.
          </p>
        </div>
      </div>

      <SuccessToast
        isOpen={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
      <ErrorToast
        isOpen={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}
