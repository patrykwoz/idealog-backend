'use client';
import { useProfileAvatar } from '@/app/ui/profile-avatar-context';
import Link from 'next/link'
import {
    SparklesIcon,
    UserIcon,
    Cog6ToothIcon,
    PowerIcon
} from '@heroicons/react/24/outline';

import styles from './profile-menu.module.css';

export default function ProfileMenu() {
    const {
        user,
        settingsModalVisible,
        toggleSettingsModal,
        settingsModalRef,
        profileMenuRef,
    } = useProfileAvatar();

    return (
        <>
            <div className={styles.profileMenuContainer}>
                <div className={styles.profileMenuItem}>
                    <SparklesIcon className={styles.profileMenuItemIcon} />
                    <p className={styles.profileMenuItemText}>
                        My Plan
                    </p>
                </div>
                <div className={styles.profileMenuItem}
                    onClick={toggleSettingsModal}
                    ref={profileMenuRef}>
                    <Cog6ToothIcon className={styles.profileMenuItemIcon} />
                    <p className={styles.profileMenuItemText}>
                        Settings
                    </p>
                </div>
                <div className={styles.profileMenuDivider}></div>
                <div className={styles.profileMenuItem}>
                    <PowerIcon className={styles.profileMenuItemIcon} />
                    <p className={styles.profileMenuItemText}>Log out</p>
                </div>
            </div>
        </>
    )
}