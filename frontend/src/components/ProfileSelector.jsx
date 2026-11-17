import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCvdType } from '../features/store.js';
import { Check } from 'lucide-react';

export const profiles = [
  { id: 'protanopia', name: 'Protanopia', short: 'Red-light sensitivity', description: 'Adds stronger labels and separation for red–green distinctions.' },
  { id: 'deuteranopia', name: 'Deuteranopia', short: 'Green-light sensitivity', description: 'Emphasizes boundaries, patterns, and text alongside green cues.' },
  { id: 'tritanopia', name: 'Tritanopia', short: 'Blue–yellow sensitivity', description: 'Strengthens labels and shape differences for blue–yellow cues.' },
  { id: 'general-accessible', name: 'General Accessible Mode', short: 'A clearer chart for everyone', description: 'Uses labels, contrast, patterns, and borders instead of hue alone.' },
];

export default function ProfileSelector({ compact = false }) {
  const value = useSelector((state) => state.preferences.cvdType);
  const dispatch = useDispatch();
  return <fieldset className={`profile-fieldset ${compact ? 'profile-compact' : ''}`}>
    <legend className="section-label">Preferred viewing profile</legend>
    <p className="muted profile-note">These are accessibility preferences, not a medical assessment.</p>
    <div className="profile-options" role="radiogroup" aria-label="Preferred color accessibility profile">
      {profiles.map((profile) => <label className={`profile-option ${value === profile.id ? 'selected' : ''}`} key={profile.id}>
        <input type="radio" name="cvdType" value={profile.id} checked={value === profile.id} onChange={() => dispatch(setCvdType(profile.id))}/>
        <span className="profile-check" aria-hidden="true">{value === profile.id && <Check size={13}/>}</span>
        <span className="profile-copy"><strong>{profile.name}</strong><small>{compact ? profile.short : profile.description}</small></span>
      </label>)}
    </div>
  </fieldset>;
}
