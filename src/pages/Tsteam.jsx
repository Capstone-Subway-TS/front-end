
import React from 'react'
import Main from '../components/section/Main'

import photo1 from '../assets/img/tsteam/jaejun.PNG';
import photo2 from '../assets/img/tsteam/jaejun.PNG';
import photo3 from '../assets/img/tsteam/jaejun.PNG';
import photo4 from '../assets/img/tsteam/jaejun.PNG';

// 팀원 정보를 담은 배열
const teamMembers = [
    { name: '팀원 1', role: '역할 1', photo: photo1, bio: '소개 1', link: 'https://example.com/member1' },
    { name: '팀원 2', role: '역할 2', photo: photo2, bio: '소개 2', link: 'https://example.com/member2' },
    { name: '팀원 3', role: '역할 3', photo: photo3, bio: '소개 3', link: 'https://example.com/member3' },
    { name: '팀원 4', role: '역할 4', photo: photo4, bio: '소개 4', link: 'https://example.com/member4' }
];

const Tsteam = () => {
    return (
        <Main title="TS팀 구성" description="TS팀 구성 페이지">
            <div className="team-section">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member">
                        <img src={member.photo} alt={member.name} />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                        <p>{member.bio}</p>
                        <a href={member.link} className="team-link" target="_blank" rel="noopener noreferrer">더보기</a>
                    </div>
                ))}
            </div>
        </Main>
    );
}

export default Tsteam;

